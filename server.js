const express = require('express');
const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Load environment variables
require('dotenv').config();

// HTML entity decoding utility
function decodeHtmlEntities(text) {
  if (!text) return text;
  
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&hellip;': '…',
    '&trade;': '™',
    '&copy;': '©',
    '&reg;': '®'
  };
  
  // Replace named entities
  let decoded = text;
  Object.keys(entities).forEach(entity => {
    decoded = decoded.replace(new RegExp(entity, 'g'), entities[entity]);
  });
  
  // Replace numeric entities (like &#88200;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
  
  // Replace hex entities (like &#x2603;)
  decoded = decoded.replace(/&#x([a-fA-F0-9]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  return decoded;
}

// Clean RSS content
function cleanRssContent(item) {
  const cleanedItem = { ...item };
  
  if (cleanedItem.title) {
    cleanedItem.title = decodeHtmlEntities(cleanedItem.title);
  }
  
  if (cleanedItem.contentSnippet) {
    cleanedItem.contentSnippet = decodeHtmlEntities(cleanedItem.contentSnippet);
  }
  
  // Priority order: content:encoded, content, contentSnippet
  if (cleanedItem['content:encoded']) {
    cleanedItem.content = decodeHtmlEntities(cleanedItem['content:encoded']);
  } else if (cleanedItem.content) {
    cleanedItem.content = decodeHtmlEntities(cleanedItem.content);
  }
  
  if (cleanedItem.creator) {
    cleanedItem.creator = decodeHtmlEntities(cleanedItem.creator);
  }
  
  // Handle dc:creator if creator is not available
  if (!cleanedItem.creator && cleanedItem['dc:creator']) {
    cleanedItem.creator = decodeHtmlEntities(cleanedItem['dc:creator']);
  }
  
  return cleanedItem;
}

const app = express();
const parser = new Parser({
  customFields: {
    item: [
      'content:encoded',
      'dc:creator',
      'media:keywords'
    ]
  }
});
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      // connectSrc: ["'self'"],
      connectSrc: ["'self'", "http:", "https:"], // This line fixes the issue
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],


    },
  },
}));
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Get base URL from environment or construct from request
function getBaseUrl(req) {
  // Use BASE_URL environment variable if set
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Fallback to constructing from request
  const host = req.get('host');
  // Force HTTP for local development, otherwise use request protocol
  if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('continuum')) {
    return `http://${host}`;
  }
  return `${req.protocol}://${host}`;
}

// Routes
app.get('/', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.render('spa', { 
    title: 'RSS Kindle Reader v2.1',
    baseUrl: baseUrl
  });
});

// Legacy routes for backward compatibility
app.get('/legacy', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.render('index', { 
    title: 'RSS Kindle Reader v2.0',
    baseUrl: baseUrl
  });
});

app.get('/feed', async (req, res) => {
  const feedUrl = req.query.url;
  const baseUrl = getBaseUrl(req);
  
  if (!feedUrl) {
    return res.status(400).render('error', { 
      title: 'Error',
      message: 'Please provide a feed URL',
      baseUrl: baseUrl
    });
  }

  try {
    // Check cache first
    const cacheKey = `feed_${feedUrl}`;
    let feed = cache.get(cacheKey);
    
    if (!feed) {
      feed = await parser.parseURL(feedUrl);
      
      // Clean the feed content
      feed.title = decodeHtmlEntities(feed.title);
      feed.description = decodeHtmlEntities(feed.description);
      feed.items = feed.items.map(cleanRssContent);
      
      cache.set(cacheKey, feed);
    }

    res.render('feed', {
      title: `RSS Reader - ${feed.title}`,
      feed: feed,
      feedUrl: feedUrl,
      baseUrl: baseUrl
    });
  } catch (error) {
    console.error('Error parsing feed:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to parse RSS feed. Please check the URL and try again.',
      baseUrl: baseUrl
    });
  }
});

// API endpoints for SPA
app.get('/api/feed', async (req, res) => {
  const feedUrl = req.query.url;
  
  if (!feedUrl) {
    return res.status(400).json({ 
      error: 'Please provide a feed URL'
    });
  }

  try {
    // Check cache first
    const cacheKey = `feed_${feedUrl}`;
    let feed = cache.get(cacheKey);
    
    if (!feed) {
      feed = await parser.parseURL(feedUrl);
      
      // Clean the feed content
      feed.title = decodeHtmlEntities(feed.title);
      feed.description = decodeHtmlEntities(feed.description);
      feed.items = feed.items.map(cleanRssContent);
      
      cache.set(cacheKey, feed);
    }

    res.json({
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items: feed.items,
      feedUrl: feedUrl
    });
  } catch (error) {
    console.error('Error parsing feed:', error);
    res.status(500).json({
      error: 'Failed to parse RSS feed. Please check the URL and try again.'
    });
  }
});

app.get('/api/article/:feedUrl/:index', async (req, res) => {
  const { feedUrl, index } = req.params;
  const articleIndex = parseInt(index);
  
  // Decode the feed URL
  const decodedFeedUrl = decodeURIComponent(feedUrl);
  
  console.log('Article request - Original feedUrl:', feedUrl);
  console.log('Article request - Decoded feedUrl:', decodedFeedUrl);
  console.log('Article request - Index:', index);
  
  try {
    // Check cache first
    const cacheKey = `feed_${decodedFeedUrl}`;
    let feed = cache.get(cacheKey);
    
    if (!feed) {
      console.log('Cache miss, fetching feed:', decodedFeedUrl);
      feed = await parser.parseURL(decodedFeedUrl);
      
      // Clean the feed content
      feed.title = decodeHtmlEntities(feed.title);
      feed.description = decodeHtmlEntities(feed.description);
      feed.items = feed.items.map(cleanRssContent);
      
      cache.set(cacheKey, feed);
    } else {
      console.log('Cache hit for feed:', decodedFeedUrl);
    }

    const article = feed.items[articleIndex];
    
    if (!article) {
      console.log('Article not found at index:', articleIndex, 'Feed has', feed.items.length, 'items');
      return res.status(404).json({
        error: 'Article not found'
      });
    }

    res.json({
      article: article,
      feedTitle: feed.title,
      feedUrl: decodedFeedUrl
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      error: 'Failed to fetch article'
    });
  }
});

app.get('/article/:feedUrl/:index', async (req, res) => {
  const { feedUrl, index } = req.params;
  const articleIndex = parseInt(index);
  const baseUrl = getBaseUrl(req);
  
  // Decode the feed URL
  const decodedFeedUrl = decodeURIComponent(feedUrl);
  
  try {
    // Check cache first
    const cacheKey = `feed_${decodedFeedUrl}`;
    let feed = cache.get(cacheKey);
    
    if (!feed) {
      feed = await parser.parseURL(decodedFeedUrl);
      
      // Clean the feed content
      feed.title = decodeHtmlEntities(feed.title);
      feed.description = decodeHtmlEntities(feed.description);
      feed.items = feed.items.map(cleanRssContent);
      
      cache.set(cacheKey, feed);
    }

    const article = feed.items[articleIndex];
    
    if (!article) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Article not found',
        baseUrl: baseUrl
      });
    }

    res.render('article', {
      title: article.title,
      article: article,
      feedTitle: feed.title,
      feedUrl: decodedFeedUrl,
      baseUrl: baseUrl
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch article',
      baseUrl: baseUrl
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RSS Kindle Reader running on port ${PORT}`);
});
