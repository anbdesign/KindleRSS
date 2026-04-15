# RSS Kindle Reader Project Instructions

This is a Cloudflare Workers RSS reader web application optimized for Kindle devices. The application emphasizes server-side rendering with minimal HTML sent to the client for optimal performance on e-ink displays.

## Key Requirements
- **Server-side rendering**: All content processing happens on the server
- **Kindle optimization**: Simple HTML, minimal CSS, high contrast design
- **Performance**: Fast loading times with caching and compression
- **Accessibility**: Clean typography using Times New Roman, large font sizes
- **Minimal client-side JavaScript**: Keep JavaScript to an absolute minimum

## Technical Stack
- **Runtime**: Cloudflare Workers (edge, serverless)
- **Router/Framework**: Hono (Workers-native, replaces Express.js)
- **Template Engine**: EJS bundled/inlined at build time (no filesystem access)
- **RSS Parsing**: rss-parser library
- **Caching**: Cloudflare KV — binding name `RSS_CACHE`, 5-minute TTL (replaces node-cache)
- **Security**: Hono secure-headers middleware (replaces helmet)
- **Performance**: Cloudflare edge network (replaces compression middleware)
- **Deployment**: Wrangler CLI (replaces Docker)

> **Note:** Cloudflare is not yet configured for this repo. The KV namespace binding (`RSS_CACHE`) will be defined in `wrangler.toml` once the Cloudflare account and worker are set up.

## API Routes
- `GET /` — Home page with feed input form and popular feed shortcuts
- `GET /feed?url=<rss_url>` — Parse and display articles from an RSS feed
- `GET /article/<feed_url>/<article_index>` — Display an individual article
- `GET /api/feed?url=<rss_url>` — JSON API: return parsed feed data
- `GET /api/article/<feed_url>/<article_index>` — JSON API: return single article data

## Target File Structure
```
├── src/
│   ├── index.js              # Worker entry point (Hono app, route registration)
│   ├── routes/
│   │   ├── feed.js           # /feed route handler
│   │   └── article.js        # /article route handler
│   └── templates/            # EJS templates (bundled at build time, not read from disk)
│       ├── layout.ejs
│       ├── index.ejs
│       ├── feed.ejs
│       ├── article.ejs
│       └── error.ejs
├── wrangler.toml             # Cloudflare Workers config (KV bindings, worker name)
├── package.json
└── CLAUDE.md
```

## Cloudflare Workers Constraints
- **No filesystem**: Templates must be imported/bundled at build time — no `fs`, no `__dirname`, no `path.join`
- **No `app.listen()`**: Export a `fetch` handler (`export default { fetch }`) — Hono handles this automatically
- **Fetch API only**: Use `fetch()` for all outbound HTTP — no `http`/`https` Node.js modules
- **Stateless execution**: In-memory state is lost between requests; all caching must go through KV
- **ES modules**: Use `import`/`export` syntax — CommonJS `require()` is not supported
- **CPU time limit**: Keep per-request CPU work minimal; Workers have a 10ms CPU limit on the free plan (50ms on paid)

## Development Commands
```bash
# Install dependencies
npm install

# Local development (Workers emulator)
wrangler dev

# Deploy to Cloudflare
wrangler deploy
```

## Design Principles
- Use black text on white background for maximum contrast
- Implement responsive design for various screen sizes
- Keep CSS inline or minimal external stylesheets
- Prioritize readability over visual complexity
- Ensure fast page load times

## Development Guidelines
- All rendering should happen server-side at the edge
- Cache RSS feeds in Cloudflare KV to reduce external requests (binding: `RSS_CACHE`)
- Use semantic HTML for better accessibility
- Implement proper error handling for RSS parsing failures
- Follow Cloudflare Workers best practices for security and performance
