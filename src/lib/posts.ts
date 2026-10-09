import archive from '../../content/paragraph_posts.json';
import top from '../../content/top-posts.json';
import { formatEssayDate } from './essays';

export type PostSource = 'most-popular' | 'proposal';
export type PostGroup = 'digital-lab' | 'newest' | 'earlier-publication';

export type Post = {
  id: string;
  title: string;
  slug: string;
  url: string;
  date: string;
  dateLabel: string;
  excerpt: string;
  subtitle: string;
  imageUrl: string;
  html: string;
  markdown: string;
};

export type TopPost = Post & {
  source: PostSource;
  group: PostGroup;
  reason: string;
};

type ArchivePost = {
  id?: string;
  title: string;
  slug: string;
  url: string;
  publishedAt: string;
  publishedAtMs?: number;
  subtitle?: string;
  excerpt?: string;
  imageUrl?: string;
  html?: string;
  markdown?: string;
};

function toPost(item: ArchivePost): Post {
  return {
    id: item.id || item.slug,
    title: item.title,
    slug: item.slug,
    url: item.url,
    date: item.publishedAt,
    dateLabel: formatEssayDate(item.publishedAt),
    excerpt: item.excerpt || '',
    subtitle: item.subtitle || '',
    imageUrl: item.imageUrl || '',
    html: item.html || '',
    markdown: item.markdown || '',
  };
}

export function loadPosts(): Post[] {
  return [...(archive.posts as ArchivePost[])]
    .sort((a, b) => (b.publishedAtMs || 0) - (a.publishedAtMs || 0) || b.publishedAt.localeCompare(a.publishedAt))
    .map(toPost);
}

export function getPost(slug: string): Post | undefined {
  return loadPosts().find((post) => post.slug === slug);
}

export function topPosts(): TopPost[] {
  const bySlug = new Map(loadPosts().map((post) => [post.slug, post]));

  return top.posts.map((item) => {
    const post = bySlug.get(item.slug);
    if (!post) {
      throw new Error(`Top post slug missing from paragraph_posts.json: ${item.slug}`);
    }
    return {
      ...post,
      source: item.source,
      group: item.group,
      reason: item.reason,
    };
  });
}

export const topPostsCopy = top;
export const archiveNote = archive.note;
export const archiveFetchedAt = archive.fetchedAt;
