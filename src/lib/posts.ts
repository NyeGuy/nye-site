import archive from '../../content/paragraph_posts.json';
import top from '../../content/top-posts.json';
import { formatEssayDate } from './essays';

export type PostSource = 'most-popular' | 'proposal';
export type PostGroup = 'digital-lab' | 'newest' | 'earlier-publication';

export type Post = {
  title: string;
  slug: string;
  url: string;
  date: string;
  dateLabel: string;
  excerpt: string;
  searchText: string;
};

export type TopPost = Post & {
  source: PostSource;
  group: PostGroup;
  reason: string;
};

export function loadPosts(): Post[] {
  return [...archive.posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((item) => ({
      title: item.title,
      slug: item.slug,
      url: item.url,
      date: item.publishedAt,
      dateLabel: formatEssayDate(item.publishedAt),
      excerpt: item.excerpt,
      searchText: `${item.title} ${item.excerpt}`.toLowerCase(),
    }));
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
