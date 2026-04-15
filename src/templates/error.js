import { escapeHtml } from '../utils.js';

export default function renderError({ title, message }) {
  return `
<h1>${escapeHtml(title)}</h1>

<div class="error">
  <p>${escapeHtml(message)}</p>
</div>

<p><a href="/">&larr; Back to Home</a></p>`;
}
