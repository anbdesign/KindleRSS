import { escapeHtml } from '../utils.js';

export default function renderFeed({ feed, feedUrl }) {
  const items = feed.items.map((item, index) => {
    const pubDate = item.pubDate
      ? `Published: ${new Date(item.pubDate).toLocaleDateString()}`
      : '';
    const creator = item.creator ? ` | By: ${escapeHtml(item.creator)}` : '';
    const snippet = item.contentSnippet
      ? `<div class="article-summary">${escapeHtml(item.contentSnippet.substring(0, 200))}${item.contentSnippet.length > 200 ? '...' : ''}</div>`
      : '';

    return `
    <li class="article-item">
      <div class="article-title">
        <a href="/article/${encodeURIComponent(feedUrl)}/${index}">${escapeHtml(item.title || '')}</a>
      </div>
      <div class="article-meta">${pubDate}${creator}</div>
      ${snippet}
    </li>`;
  }).join('\n');

  const description = feed.description
    ? `<p>${escapeHtml(feed.description)}</p>`
    : '';
  const website = feed.link
    ? `<p><strong>Website:</strong> <a href="${escapeHtml(feed.link)}" target="_blank">${escapeHtml(feed.link)}</a></p>`
    : '';

  return `
<h1>${escapeHtml(feed.title)}</h1>
${description}
${website}
<h2>Articles (${feed.items.length})</h2>
<ul class="article-list">
${items}
</ul>`;
}
