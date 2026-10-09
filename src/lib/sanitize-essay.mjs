import { parse } from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

function replaceWithHtml(el, html) {
  el.insertAdjacentHTML('beforebegin', html);
  el.remove();
}

function prepare(raw) {
  const stripped = String(raw || '').replace(/\sblurdataurl=(?:"[^"]*"|'[^']*')/gi, '');
  const root = parse(`<div id="essay-root">${stripped}</div>`, { blockTextElements: { script: true, style: true } });
  const box = root.querySelector('#essay-root');
  if (!box) return '';

  box.querySelectorAll('[data-type="subscribeButton"], [data-type="shareButton"], [data-type="x402Embed"]').forEach((el) => {
    el.remove();
  });

  box.querySelectorAll('[data-type="youtube"]').forEach((el) => {
    const id = el.getAttribute('videoid') || '';
    if (!/^[\w-]{6,}$/.test(id)) {
      el.remove();
      return;
    }
    const url = `https://www.youtube.com/watch?v=${id}`;
    const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    replaceWithHtml(
      el,
      `<figure><a href="${url}"><img src="${thumb}" alt="Video on YouTube"></a><figcaption><a href="${url}">Watch on YouTube</a></figcaption></figure>`,
    );
  });

  box.querySelectorAll('[data-type="embedly"]').forEach((el) => {
    let data = {};
    const rawData = el.getAttribute('data') || '';
    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch {
        data = {};
      }
    }
    const url = typeof data.url === 'string' ? data.url : el.getAttribute('src') || '';
    const title = typeof data.title === 'string' && data.title.trim() ? data.title.trim() : url;
    const thumb = typeof data.thumbnail_url === 'string' ? data.thumbnail_url : '';
    if (!/^https?:\/\//i.test(url)) {
      el.remove();
      return;
    }
    const img = /^https:\/\//i.test(thumb)
      ? `<img src="${escapeAttr(thumb)}" alt="">`
      : '';
    replaceWithHtml(
      el,
      `<figure><a href="${escapeAttr(url)}">${img}<span>${escapeText(title)}</span></a></figure>`,
    );
  });

  box.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!/^https:\/\//i.test(src) || src.includes('/editor/') || src.includes('{{')) img.remove();
  });

  box.querySelectorAll('link, svg, script, style, iframe, object, embed').forEach((el) => el.remove());

  box.querySelectorAll('[data-type="callout"]').forEach((el) => {
    const content = el.querySelector('.callout-content');
    const inner = content ? content.innerHTML : el.innerHTML;
    replaceWithHtml(el, `<aside>${inner}</aside>`);
  });

  box.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!href || /^(https?:\/\/|mailto:)/i.test(href)) return;
    replaceWithHtml(a, a.innerHTML);
  });

  box.querySelectorAll('h1').forEach((heading) => {
    if (!heading.text.trim()) {
      heading.remove();
      return;
    }
    heading.tagName = 'h2';
  });

  return box.innerHTML;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function sanitizeEssay(raw) {
  const prepared = prepare(raw);
  return sanitizeHtml(prepared, {
    allowedTags: [
      'p', 'br', 'hr',
      'h2', 'h3', 'h4',
      'blockquote', 'aside',
      'ul', 'ol', 'li',
      'strong', 'em', 'u', 's',
      'a', 'img',
      'figure', 'figcaption',
      'pre', 'code',
      'span',
    ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      a: ['href', 'rel'],
      img: ['src', 'alt', 'loading', 'decoding'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || '';
        if (!/^(https?:\/\/|mailto:)/i.test(href)) {
          return { tagName: 'span', attribs: {} };
        }
        return {
          tagName: 'a',
          attribs: { href, rel: 'noopener noreferrer' },
        };
      },
      img: (tagName, attribs) => {
        const src = attribs.src || '';
        if (!/^https:\/\//i.test(src)) return { tagName: 'span', attribs: {} };
        return {
          tagName: 'img',
          attribs: {
            src,
            alt: attribs.alt || '',
            loading: 'lazy',
            decoding: 'async',
          },
        };
      },
    },
  });
}

export function renderEssayHtml(post) {
  const html = typeof post.html === 'string' ? post.html.trim() : '';
  const markdown = typeof post.markdown === 'string' ? post.markdown.trim() : '';
  let safe = html ? sanitizeEssay(html) : '';
  if (!safe.trim() && markdown) {
    safe = sanitizeEssay(marked.parse(markdown));
  }
  const imageUrl = typeof post.imageUrl === 'string' ? post.imageUrl : '';
  if (/^https:\/\//i.test(imageUrl) && !/<img\b/i.test(safe)) {
    const lead = sanitizeEssay(`<figure><img src="${escapeAttr(imageUrl)}" alt=""></figure>`);
    safe = `${lead}${safe}`;
  }
  return safe;
}
