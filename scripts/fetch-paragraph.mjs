import { writeFileSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicationId = 'V98bkWzhrotAwDhbneW0';
const publicationUrl = 'https://paragraph.com/@nyewarburton.eth';
const endpoint = `https://public.api.paragraph.com/api/v1/publications/${publicationId}/posts`;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function stripBlur(html) {
  return String(html || '').replace(/\sblurdataurl=(?:"[^"]*"|'[^']*')/gi, '');
}

function plainText(html) {
  return cleanText(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))),
  );
}

function excerptOf(subtitle, text) {
  if (subtitle) return subtitle;
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  const space = cut.lastIndexOf(' ');
  return `${(space > 140 ? cut.slice(0, space) : cut).trim()}…`;
}

function isoDay(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

async function fetchAll() {
  const items = [];
  let cursor = '';
  let guard = 0;
  do {
    const url = new URL(endpoint);
    url.searchParams.set('limit', '100');
    url.searchParams.set('includeContent', 'true');
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const page = Array.isArray(data.items) ? data.items : [];
    items.push(...page);
    const more = Boolean(data.pagination?.hasMore);
    cursor = more ? data.pagination?.cursor || '' : '';
    if (more && !cursor) throw new Error('pagination cursor missing');
    guard += 1;
  } while (cursor && guard < 20);
  return items;
}

function writeJson(filename, value) {
  const path = join(root, 'content', filename);
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(tmp, path);
}

try {
  const items = await fetchAll();
  if (!items.length) throw new Error('API returned no posts');

  const missingContent = [];
  const posts = items.map((item) => {
    const slug = cleanText(item.slug);
    const title = cleanText(item.title);
    const html = stripBlur(item.staticHtml);
    const markdown = typeof item.markdown === 'string' ? item.markdown : '';
    if (!html.trim() && !markdown.trim()) missingContent.push(slug);
    const subtitle = cleanText(item.subtitle);
    const text = plainText(html) || plainText(markdown);
    const publishedAtMs = Number(item.publishedAt) || 0;
    return {
      id: item.id || slug,
      title,
      slug,
      url: `${publicationUrl}/${slug}`,
      publishedAt: publishedAtMs ? isoDay(publishedAtMs) : '',
      publishedAtMs,
      subtitle,
      excerpt: excerptOf(subtitle, text),
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
      html,
      markdown,
    };
  });

  posts.sort((a, b) => b.publishedAtMs - a.publishedAtMs || a.slug.localeCompare(b.slug));

  const fetchedAt = new Date().toISOString();
  writeJson('paragraph_posts.json', {
    source: endpoint,
    publicationId,
    publicationUrl,
    fetchedAt,
    count: posts.length,
    missingContent,
    note: 'Full-text snapshot of Nye’s Digital Lab. `npm run build` fetches public.api.paragraph.com with a browser User-Agent (the default agent is rejected). includeContent=true returns markdown and staticHtml; cursor pagination is followed until hasMore is false. This file is committed so the build still renders if that request fails. HTML has Paragraph blur placeholders removed. Not a ranking.',
    posts,
  });

  writeJson('writing-search.json', posts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    dateLabel: post.publishedAt,
    text: plainText(post.html) || plainText(post.markdown),
  })));

  const withHtml = posts.filter((post) => post.html.trim()).length;
  const withMarkdown = posts.filter((post) => post.markdown.trim()).length;
  console.log(`Wrote ${posts.length} posts (${withHtml} html, ${withMarkdown} markdown). Missing content: ${missingContent.length ? missingContent.join(', ') : 'none'}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`Paragraph fetch failed (${message}). Using the committed snapshot.`);
  process.exit(0);
}
