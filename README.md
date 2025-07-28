# RSS Kindle Reader

A Node.js-based RSS reader web application optimized for Kindle devices. This application emphasizes server-side rendering with minimal HTML sent to the client for optimal performance on e-ink displays.

## Features

- **Server-side RSS parsing and rendering**
- **Kindle-optimized design** with high contrast and readable typography
- **Caching system** for improved performance
- **Docker containerization** for easy deployment
- **Popular RSS feeds** pre-configured for quick access
- **Article reading** with clean, distraction-free layout
- **Responsive design** for various screen sizes

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Or build and run with Docker:**
   ```bash
   docker build -t rss-kindle-reader .
   docker run -p 3000:3000 rss-kindle-reader
   ```

3. **Access the application:**
   Open your browser to `http://localhost:3000`

### Manual Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **For development with auto-reload:**
   ```bash
   npm run dev
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
- **Server-side Rendering**: All processing happens on the server
- **No JavaScript**: Minimal client-side JavaScript for better performance

## Technical Details

### Architecture

- **Backend**: Node.js with Express.js
- **Template Engine**: EJS for server-side rendering
- **RSS Parsing**: rss-parser library
- **Caching**: node-cache (5-minute TTL)
- **Security**: Helmet middleware for security headers
- **Performance**: Compression middleware

### API Endpoints

- `GET /` - Home page with feed input form
- `GET /feed?url=<rss_url>` - Display articles from RSS feed
- `GET /article/<feed_url>/<article_index>` - Display individual article

### Docker Configuration

The application includes:
- **Multi-stage Dockerfile** with Alpine Linux for minimal size
- **Health checks** for container monitoring
- **Non-root user** for security
- **Docker Compose** for easy orchestration

## Development

### File Structure

```
├── server.js              # Main application server
├── healthcheck.js          # Docker health check script
├── package.json           # Dependencies and scripts
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── views/                 # EJS templates
│   ├── layout.ejs        # Base layout with CSS
│   ├── index.ejs         # Home page
│   ├── feed.ejs          # RSS feed listing
│   ├── article.ejs       # Individual article view
│   └── error.ejs         # Error page
└── .github/
    └── copilot-instructions.md  # Copilot guidelines
```

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (production/development)
- `BASE_URL` - Base URL for the application (optional)
  - If not set, auto-detects from request
  - Examples: `https://your-domain.com`, `http://localhost:3000`
  - Useful for deployment behind proxies or custom domains

### Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your settings:**
   ```bash
   # Example configuration
   BASE_URL=https://your-domain.com
   PORT=3000
   NODE_ENV=production
   ```

This configuration ensures absolute URLs work correctly when switching between HTTP and HTTPS or when deployed behind reverse proxies.

### Contributing

1. Follow the Kindle optimization principles
2. Maintain server-side rendering approach
3. Keep client-side JavaScript minimal
4. Test on actual Kindle devices when possible
5. Ensure accessibility and readability

## License

ISC License
