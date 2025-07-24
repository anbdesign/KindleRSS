const express = require('express');
const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

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
app.use(helmet());
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  // Force HTTP for local development, otherwise use request protocol
  const host = req.get('host');
  console.log('get / ', host)

  const baseUrl = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('continuum')
    ? `http://${host}` 
    : `${req.protocol}://${host}`;

  console.log('baseUrl: ', baseUrl)
  res.render('index', { 
    title: 'RSS Kindle Reader v1.6',
    baseUrl: baseUrl
  });
});

app.get('/feed', async (req, res) => {
  const feedUrl = req.query.url;
  // Force HTTP for local development, otherwise use request protocol
  const host = req.get('host');
  const baseUrl = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('continuum')
    ? `http://${host}` 
    : `${req.protocol}://${host}`;
  
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

app.get('/article/:feedUrl/:index', async (req, res) => {
  const { feedUrl, index } = req.params;
  const articleIndex = parseInt(index);
  // Force HTTP for local development, otherwise use request protocol
  const host = req.get('host');
  const baseUrl = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('continuum')
    ? `http://${host}` 
    : `${req.protocol}://${host}`;
  

      console.log('/article/:feedUrl/:index - baseUrl: ', baseUrl)

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
      feedUrl: feedUrl,
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
