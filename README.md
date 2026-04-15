# RSS Kindle Reader

A Cloudflare Workers RSS reader web application optimized for Kindle devices. This application emphasizes server-side rendering at the edge with minimal HTML sent to the client for optimal performance on e-ink displays.

## Features

- **Server-side RSS parsing and rendering** at the Cloudflare edge
- **Kindle-optimized design** with high contrast and readable typography
- **Caching** via Cloudflare KV for improved performance
- **Popular RSS feeds** pre-configured for quick access
- **Article reading** with clean, distraction-free layout
- **Responsive design** for various screen sizes

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- A Cloudflare account (for deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local Workers emulator:**
   ```bash
   wrangler dev
   ```

3. **Access the application:**
   Open your browser to `http://localhost:8787`

### Deployment

1. **Authenticate with Cloudflare:**
   ```bash
   wrangler login
   ```

2. **Deploy to Cloudflare Workers:**
   ```bash
   wrangler deploy
   ```

## Usage

1. **Home Page**: Enter any RSS feed URL or select from popular feeds
2. **Feed View**: Browse articles with titles, publication dates, and summaries
3. **Article View**: Read full articles with clean, Kindle-optimized formatting

## Kindle Optimization

The application is specifically designed for Kindle devices:

- **Typography**: Uses Times New Roman for familiarity and readability
- **Contrast**: High contrast black text on white background
- **Font Size**: Larger fonts (18px base) for comfortable reading
- **Minimal CSS**: Reduced styling for faster loading
- **Server-side Rendering**: All processing happens at the edge
- **No JavaScript**: Minimal client-side JavaScript for better performance

## Technical Details

### Architecture

- **Runtime**: Cloudflare Workers (edge, serverless)
- **Router/Framework**: Hono (Workers-native)
- **Template Engine**: EJS bundled/inlined at build time
- **RSS Parsing**: rss-parser library
- **Caching**: Cloudflare KV (`RSS_CACHE` binding, 5-minute TTL)
- **Security**: Hono secure-headers middleware
- **Performance**: Cloudflare edge network

### API Endpoints

- `GET /` — Home page with feed input form
- `GET /feed?url=<rss_url>` — Display articles from RSS feed
- `GET /article/<feed_url>/<article_index>` — Display individual article
- `GET /api/feed?url=<rss_url>` — JSON: parsed feed data
- `GET /api/article/<feed_url>/<article_index>` — JSON: single article data

### File Structure

```
├── src/
│   ├── index.js              # Worker entry point (Hono app)
│   ├── routes/
│   │   ├── feed.js           # /feed route handler
│   │   └── article.js        # /article route handler
│   └── templates/            # EJS templates (bundled at build time)
│       ├── layout.ejs
│       ├── index.ejs
│       ├── feed.ejs
│       ├── article.ejs
│       └── error.ejs
├── wrangler.toml             # Cloudflare Workers config
├── package.json
└── CLAUDE.md                 # AI assistant guidelines
```

### Environment Variables

Cloudflare Workers uses `wrangler.toml` for configuration rather than `.env` files. The following bindings and variables apply:

- `RSS_CACHE` — KV namespace binding for RSS feed caching
- `BASE_URL` — Base URL for the worker (optional; auto-detected from request if not set)
- `NODE_ENV` — Environment mode (`production` / `development`)

## Contributing

1. Follow the Kindle optimization principles
2. Maintain server-side rendering approach
3. Keep client-side JavaScript minimal
4. Test on actual Kindle devices when possible
5. Ensure accessibility and readability
6. Follow Cloudflare Workers best practices (no filesystem, fetch API only, ES modules)

## License

ISC License
