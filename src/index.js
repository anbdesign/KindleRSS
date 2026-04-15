import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import feedRoutes from './routes/feed.js';
import articleRoutes from './routes/article.js';
import renderSpa from './templates/spa.js';

const app = new Hono();

app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'http:', 'https:'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  })
);

// Home — SPA interface
app.get('/', (c) => c.html(renderSpa()));

app.route('/', feedRoutes);
app.route('/', articleRoutes);

export default app;
