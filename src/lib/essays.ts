import catalog from '../../content/essays.json';

export type Essay = {
  title: string;
  date: string;
  dateLabel: string;
  url: string;
  blurb: string;
  searchText: string;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function loadEssays(): Essay[] {
  return catalog.essays.map((item) => ({
    title: item.title,
    date: item.date,
    dateLabel: formatEssayDate(item.date),
    url: item.url,
    blurb: item.blurb,
    searchText: `${item.title} ${item.blurb}`.toLowerCase(),
  }));
}

export function recentEssays(limit: number): Essay[] {
  return [...loadEssays()]
    .sort((a, b) => sortKey(b.date) - sortKey(a.date))
    .slice(0, limit);
}

export function formatEssayDate(value: string): string {
  if (/^\d{4}$/.test(value) || /–/.test(value)) return value;

  const month = value.match(/^(\d{4})-(\d{2})$/);
  if (month) {
    const monthIndex = Number(month[2]) - 1;
    return `${MONTHS[monthIndex] ?? month[2]} ${month[1]}`;
  }

  const day = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) {
    const monthIndex = Number(day[2]) - 1;
    return `${Number(day[3])} ${MONTHS[monthIndex] ?? day[2]} ${day[1]}`;
  }

  return value;
}

function sortKey(value: string): number {
  const day = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return Number(day[1] + day[2] + day[3]);

  const month = value.match(/^(\d{4})-(\d{2})$/);
  if (month) return Number(month[1] + month[2] + '00');

  const years = value.match(/(\d{4})/g);
  if (years?.length) return Number(years[years.length - 1] + '0000');

  return 0;
}
