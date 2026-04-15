import ejs from 'ejs';
import layoutTemplate from './templates/layout.ejs';

// Render a page template inside the shared layout.
// The layout expects a `body` variable containing the rendered inner HTML.
export function renderPage(template, data) {
  const body = ejs.render(template, data);
  return ejs.render(layoutTemplate, { ...data, body });
}
