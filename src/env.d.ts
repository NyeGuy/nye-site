/// <reference path="../.astro/types.d.ts" />

declare module '*sanitize-essay.mjs' {
  export function sanitizeEssay(raw: string): string;
  export function renderEssayHtml(post: {
    html?: string;
    markdown?: string;
    imageUrl?: string;
  }): string;
}
