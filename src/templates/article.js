import { escapeHtml } from '../utils.js';

export default function renderArticle({ article, feedTitle, feedUrl }) {
  const pubDate = article.pubDate
    ? `<strong>Published:</strong> ${new Date(article.pubDate).toLocaleDateString()}`
    : '';
  const creator = article.creator
    ? ` | <strong>By:</strong> ${escapeHtml(article.creator)}`
    : '';
  const originalLink = article.link
    ? ` | <strong>Original:</strong> <a href="${escapeHtml(article.link)}" target="_blank">View Original</a>`
    : '';

  // Article content is raw HTML from the RSS feed — rendered unescaped intentionally,
  // matching the original <%- %> EJS behaviour.
  let content = '<p>No content available for this article.</p>';
  if (article.content) {
    content = article.content;
  } else if (article['content:encoded']) {
    content = article['content:encoded'];
  } else if (article.contentSnippet) {
    content = `<p>${escapeHtml(article.contentSnippet)}</p>`;
  } else if (article.description) {
    content = `<p>${escapeHtml(article.description)}</p>`;
  }

  const keywords = article['media:keywords']
    ? `<div class="article-tags"><strong>Keywords:</strong> ${escapeHtml(article['media:keywords'])}</div>`
    : '';
  const categories = article.categories && article.categories.length > 0
    ? `<div class="article-categories"><strong>Categories:</strong> ${escapeHtml(article.categories.join(', '))}</div>`
    : '';

  return `
<h1>${escapeHtml(article.title || '')}</h1>

<div class="article-meta">
  ${pubDate}${creator}${originalLink}
</div>

<div class="article-content">
  ${content}
</div>

${keywords}
${categories}

<div class="back-link">
  <a href="/feed?url=${encodeURIComponent(feedUrl)}">&larr; Back to ${escapeHtml(feedTitle)}</a>
</div>`;
}
