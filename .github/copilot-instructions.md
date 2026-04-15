<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# RSS Kindle Reader Project Instructions

This is a Node.js RSS reader web application optimized for Kindle devices. The application emphasizes:

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
- **Caching**: Cloudflare KV (replaces node-cache)
- **Security**: Hono secure-headers middleware (replaces helmet)
- **Performance**: Cloudflare edge network (replaces compression middleware)
- **Deployment**: Wrangler CLI (replaces Docker)

## Design Principles
- Use black text on white background for maximum contrast
- Implement responsive design for various screen sizes
- Keep CSS inline or minimal external stylesheets
- Prioritize readability over visual complexity
- Ensure fast page load times

## Development Guidelines
- All rendering should happen server-side
- Cache RSS feeds to reduce external requests
- Use semantic HTML for better accessibility
- Implement proper error handling for RSS parsing
- Follow Node.js best practices for security and performance
