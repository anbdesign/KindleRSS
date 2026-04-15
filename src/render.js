import layout from './templates/layout.js';

// Render a page template function inside the shared layout.
export function renderPage(templateFn, data) {
  const body = templateFn(data);
  return layout({ ...data, body });
}
