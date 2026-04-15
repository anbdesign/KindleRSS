import { Hono } from 'hono';
import { parseFeed } from '../utils.js';
import { renderPage } from '../render.js';
import articleTemplate from '../templates/article.ejs';
import errorTemplate from '../templates/error.ejs';

const article = new Hono();

article.get('/article/:feedUrl/:index', async (c) => {
  const feedUrl = decodeURIComponent(c.req.param('feedUrl'));
  const articleIndex = parseInt(c.req.param('index'));

  try {
    const feed = await parseFeed(feedUrl, c.env);
    const articleItem = feed.items[articleIndex];

    if (!articleItem) {
      const html = renderPage(errorTemplate, { title: 'Error', message: 'Article not found' });
      return c.html(html, 404);
    }

    const html = renderPage(articleTemplate, {
      title: articleItem.title,
      article: articleItem,
      feedTitle: feed.title,
      feedUrl,
    });
    return c.html(html);
  } catch (err) {
    const html = renderPage(errorTemplate, { title: 'Error', message: 'Failed to fetch article' });
    return c.html(html, 500);
  }
});

article.get('/api/article/:feedUrl/:index', async (c) => {
  const feedUrl = decodeURIComponent(c.req.param('feedUrl'));
  const articleIndex = parseInt(c.req.param('index'));

  try {
    const feed = await parseFeed(feedUrl, c.env);
    const articleItem = feed.items[articleIndex];

    if (!articleItem) {
      return c.json({ error: 'Article not found' }, 404);
    }

    return c.json({ article: articleItem, feedTitle: feed.title, feedUrl });
  } catch (err) {
    return c.json({ error: 'Failed to fetch article' }, 500);
  }
});

export default article;
