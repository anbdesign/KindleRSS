import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'dc:creator', 'media:keywords'],
  },
});

export function decodeHtmlEntities(text) {
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
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&hellip;': '…',
    '&trade;': '™',
    '&copy;': '©',
    '&reg;': '®',
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  decoded = decoded.replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  return decoded;
}

export function cleanRssContent(item) {
  const out = { ...item };

  if (out.title) out.title = decodeHtmlEntities(out.title);
  if (out.contentSnippet) out.contentSnippet = decodeHtmlEntities(out.contentSnippet);

  // Priority: content:encoded > content
  if (out['content:encoded']) {
    out.content = decodeHtmlEntities(out['content:encoded']);
  } else if (out.content) {
    out.content = decodeHtmlEntities(out.content);
  }

  if (out.creator) {
    out.creator = decodeHtmlEntities(out.creator);
  } else if (out['dc:creator']) {
    out.creator = decodeHtmlEntities(out['dc:creator']);
  }

  return out;
}

// Fetch, parse, and cache an RSS feed via Cloudflare KV.
// Uses fetch() + parseString() to stay within Workers constraints
// (no Node.js http module required).
export async function parseFeed(feedUrl, env) {
  const cacheKey = `feed_${feedUrl}`;

  const cached = await env.RSS_CACHE.get(cacheKey, { type: 'json' });
  if (cached) return cached;

  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch feed (${response.status}): ${feedUrl}`);
  }
  const xml = await response.text();
  const feed = await parser.parseString(xml);

  feed.title = decodeHtmlEntities(feed.title);
  feed.description = decodeHtmlEntities(feed.description);
  feed.items = feed.items.map(cleanRssContent);

  await env.RSS_CACHE.put(cacheKey, JSON.stringify(feed), { expirationTtl: 300 });

  return feed;
}
