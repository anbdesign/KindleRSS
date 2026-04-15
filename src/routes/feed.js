import { Hono } from 'hono';
import { parseFeed } from '../utils.js';
import { renderPage } from '../render.js';
import feedTemplate from '../templates/feed.ejs';
import errorTemplate from '../templates/error.ejs';

const feed = new Hono();

feed.get('/feed', async (c) => {
  const feedUrl = c.req.query('url');

  if (!feedUrl) {
    const html = renderPage(errorTemplate, { title: 'Error', message: 'Please provide a feed URL' });
    return c.html(html, 400);
  }

  try {
    const feedData = await parseFeed(feedUrl, c.env);
    const html = renderPage(feedTemplate, {
      title: `RSS Reader - ${feedData.title}`,
      feed: feedData,
      feedUrl,
    });
    return c.html(html);
  } catch (err) {
    const html = renderPage(errorTemplate, {
      title: 'Error',
      message: 'Failed to parse RSS feed. Please check the URL and try again.',
    });
    return c.html(html, 500);
  }
});

feed.get('/api/feed', async (c) => {
  const feedUrl = c.req.query('url');

  if (!feedUrl) {
    return c.json({ error: 'Please provide a feed URL' }, 400);
  }

  try {
    const feedData = await parseFeed(feedUrl, c.env);
    return c.json({
      title: feedData.title,
      description: feedData.description,
      link: feedData.link,
      items: feedData.items,
      feedUrl,
    });
  } catch (err) {
    return c.json({ error: 'Failed to parse RSS feed. Please check the URL and try again.' }, 500);
  }
});

export default feed;
