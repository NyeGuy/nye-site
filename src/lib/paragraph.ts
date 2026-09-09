export const PARAGRAPH_RSS_URL = 'https://paragraph.com/@nyewarburton.eth/rss';

export type ParagraphPost = {
  title: string;
  url: string;
  date: string;
  dateLabel: string;
  description: string;
};

const FETCH_TIMEOUT_MS = 15_000;

let cached: ParagraphPost[] | null = null;

export async function getParagraphPosts(): Promise<ParagraphPost[]> {
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(PARAGRAPH_RSS_URL, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`Paragraph RSS returned ${response.status}`);
      cached = [];
      return cached;
    }

    cached = parseParagraphRss(await response.text());
    return cached;
  } catch (error) {
    console.warn('Paragraph RSS ingest failed:', error);
    cached = [];
    return cached;
  } finally {
    clearTimeout(timer);
  }
}

export function parseParagraphRss(xml: string): ParagraphPost[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return items
    .map((block) => {
      const title = firstTag(block, 'title');
      const url = firstTag(block, 'link');
      const pubDate = firstTag(block, 'pubDate');
      const description = stripMarkup(firstTag(block, 'description'));
      const { iso, label } = formatPostDate(pubDate);

      return {
        title,
        url,
        date: iso,
        dateLabel: label,
        description,
      };
    })
    .filter((post) => post.title && post.url);
}

function firstTag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decodeRssText(match[1]) : '';
}

function decodeRssText(value: string): string {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function stripMarkup(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function formatPostDate(value: string): { iso: string; label: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { iso: '', label: value };
  }

  return {
    iso: date.toISOString().slice(0, 10),
    label: new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date),
  };
}
