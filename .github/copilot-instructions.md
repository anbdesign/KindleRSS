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
- **Backend**: Node.js with Express.js
- **Template Engine**: EJS for server-side rendering
- **RSS Parsing**: rss-parser library
- **Caching**: node-cache for RSS feed caching
- **Security**: helmet for security headers
- **Performance**: compression middleware
- **Containerization**: Docker with health checks

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
