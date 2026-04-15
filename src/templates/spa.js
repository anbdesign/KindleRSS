// The SPA is fully self-contained — all data fetching and rendering
// happens client-side via fetch() calls to /feed and /article.
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSS Kindle Reader v2.3</title>
  <style>
    body {
      font-family: "Times New Roman", serif;
      font-size: 18px;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #ffffff;
      color: #000000;
      max-width: 800px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      color: #000000;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    h1 {
      font-size: 24px;
      border-bottom: 2px solid #000000;
      padding-bottom: 10px;
    }

    h2 {
      font-size: 20px;
    }

    h3 {
      font-size: 18px;
    }

    a {
      color: #000000;
      text-decoration: underline;
      cursor: pointer;
    }

    a:hover {
      background-color: #f0f0f0;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
    }

    .nav {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
    }

    .nav a {
      margin-right: 20px;
      font-weight: bold;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input[type="url"] {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 2px solid #000000;
      background-color: #ffffff;
      color: #000000;
    }

    button {
      background-color: #000000;
      color: #ffffff;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #333333;
    }

    .error {
      color: #000000;
      background-color: #f0f0f0;
      padding: 20px;
      border: 2px solid #000000;
      margin: 20px 0;
    }

    .loading {
      text-align: center;
      font-style: italic;
      margin: 20px 0;
    }

    .article-list {
      list-style: none;
      padding: 0;
    }

    .article-item {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
    }

    .article-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .article-meta {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }

    .article-summary {
      margin-bottom: 10px;
    }

    .article-content {
      line-height: 1.8;
      margin-bottom: 20px;
    }

    .article-content p {
      margin-bottom: 15px;
    }

    .article-content img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 20px 0;
    }

    .back-link {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
    }

    .article-tags, .article-categories {
      margin-top: 15px;
      padding: 10px;
      background-color: #f9f9f9;
      border-left: 3px solid #000;
      font-size: 16px;
    }

    .hidden {
      display: none;
    }

    /* Kindle-specific optimizations */
    @media (max-width: 600px) {
      body {
        font-size: 16px;
        padding: 10px;
      }

      h1 {
        font-size: 22px;
      }

      h2 {
        font-size: 18px;
      }

      .nav a {
        display: block;
        margin: 10px 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="nav">
      <a href="#" id="home-link">Home</a>
      <span id="breadcrumb"></span>
    </div>

    <div id="content">
      <!-- Home content -->
      <div id="home-content">
        <h1>RSS Kindle Reader v2.3</h1>

        <form id="feed-form">
          <div class="form-group">
            <label for="url">RSS Feed URL:</label>
            <input type="url" id="url" name="url" placeholder="https://example.com/feed.xml" required>
          </div>
          <button type="submit">Load Feed</button>
        </form>

        <h2>Popular RSS Feeds</h2>
        <ul id="popular-feeds">
          <li><a href="#" data-feed-url="https://feeds.bbci.co.uk/news/rss.xml">BBC News</a></li>
          <li><a href="#" data-feed-url="https://rss.cnn.com/rss/edition.rss">CNN</a></li>
          <li><a href="#" data-feed-url="https://feeds.reuters.com/Reuters/worldNews">Reuters World News</a></li>
          <li><a href="#" data-feed-url="https://feeds.feedburner.com/TechCrunch">TechCrunch</a></li>
          <li><a href="#" data-feed-url="https://feeds.arstechnica.com/arstechnica/index">Ars Technica</a></li>
          <li><a href="#" data-feed-url="https://daringfireball.net/feeds/main">Daring Fireball</a></li>
          <li><a href="#" data-feed-url="https://www.raptitude.com/feed/">Raptitude</a></li>
          <li><a href="#" data-feed-url="https://morss.it/https://www.raptitude.com/feed/">Raptitude (MORSS)</a></li>
          <li><a href="#" data-feed-url="https://www.theverge.com/rss/partner/subscriber-only-full-feed/rss.xml">The Verge (Articles)</a></li>
          <li><a href="#" data-feed-url="https://www.theverge.com/rss/quickposts">The Verge (Quick Posts)</a></li>
          <li><a href="#" data-feed-url="https://arun.is/rss.xml">Arun.is</a></li>
          <li><a href="#" data-feed-url="https://stephango.com/feed.xml">Stephango</a></li>
          <li><a href="#" data-feed-url="https://feeds.kottke.org/main">Kottke.org</a></li>
          <li><a href="#" data-feed-url="https://wp.theringer.com/feed/">The Ringer</a></li>
          <li><a href="#" data-feed-url="https://www.techmeme.com/feed.xml">Techmeme</a></li>
          <li><a href="#" data-feed-url="https://feeds.feedblitz.com/sethsblog">Seth's Blog</a></li>
          <li><a href="#" data-feed-url="https://morss.it/https://news.ycombinator.com/rss">Hacker News</a></li>
        </ul>
      </div>

      <!-- Feed content -->
      <div id="feed-content" class="hidden">
        <div id="feed-info"></div>
        <div id="feed-articles"></div>
      </div>

      <!-- Article content -->
      <div id="article-content" class="hidden">
        <div id="article-content-container"></div>
      </div>

      <!-- Loading indicator -->
      <div id="loading" class="loading hidden">Loading...</div>

      <!-- Error display -->
      <div id="error" class="error hidden"></div>
    </div>
  </div>

  <script>
    let currentFeed = null;

    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        showHome();
      });

      document.getElementById('feed-form').addEventListener('submit', function(e) {
        e.preventDefault();
        loadFeed();
      });

      document.getElementById('popular-feeds').addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.dataset.feedUrl) {
          e.preventDefault();
          loadFeedByUrl(e.target.dataset.feedUrl);
        }
      });
    });

    function showContent(contentId) {
      document.getElementById('home-content').classList.add('hidden');
      document.getElementById('feed-content').classList.add('hidden');
      document.getElementById('article-content').classList.add('hidden');
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('error').classList.add('hidden');
      document.getElementById(contentId).classList.remove('hidden');
    }

    function showLoading() { showContent('loading'); }

    function showError(message) {
      document.getElementById('error').innerHTML = message;
      showContent('error');
    }

    function showHome() {
      showContent('home-content');
      document.getElementById('breadcrumb').innerHTML = '';
      currentFeed = null;
    }

    function loadFeed() {
      const url = document.getElementById('url').value;
      if (url) loadFeedByUrl(url);
    }

    function loadFeedByUrl(feedUrl) {
      showLoading();
      const baseUrl = window.location.protocol + '//' + window.location.host;
      const apiUrl = baseUrl + '/feed?url=' + encodeURIComponent(feedUrl);

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
        })
        .then(html => displayFeedHtml(html, feedUrl))
        .catch(error => {
          showError('Failed to load feed. Please check your connection and try again. Error: ' + error.message);
        });
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function displayFeedHtml(html, feedUrl) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const mainContent = doc.querySelector('main') || doc.querySelector('.container') || doc.body;

      const breadcrumbElement = doc.querySelector('#breadcrumb');
      if (breadcrumbElement) {
        document.getElementById('breadcrumb').innerHTML = breadcrumbElement.innerHTML;
      }

      const feedInfo = mainContent.querySelector('.feed-info') || mainContent.querySelector('h1').parentElement;
      const articlesList = mainContent.querySelector('.articles') || mainContent.querySelector('ul');

      if (feedInfo) {
        document.getElementById('feed-info').innerHTML = feedInfo.innerHTML;
      }

      const target = articlesList || mainContent;
      document.getElementById('feed-articles').innerHTML = articlesList ? articlesList.outerHTML : mainContent.innerHTML;
      if (!articlesList) document.getElementById('feed-info').innerHTML = '';

      document.querySelectorAll('#feed-articles a[href*="/article/"]').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const match = this.getAttribute('href').match(/\/article\/([^\/]+)\/(\d+)/);
          if (match) loadArticleHtml(decodeURIComponent(match[1]), parseInt(match[2]));
        });
      });

      currentFeed = { feedUrl: feedUrl };
      showContent('feed-content');
    }

    function loadArticleHtml(feedUrl, index) {
      showLoading();
      const baseUrl = window.location.protocol + '//' + window.location.host;
      const apiUrl = baseUrl + '/article/' + encodeURIComponent(feedUrl) + '/' + index;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
        })
        .then(html => displayArticleHtml(html, feedUrl))
        .catch(error => {
          showError('Failed to load article. Please check your connection and try again. Error: ' + error.message);
        });
    }

    function displayArticleHtml(html, feedUrl) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const mainContent = doc.querySelector('main') || doc.querySelector('.container') || doc.body;

      const breadcrumbElement = doc.querySelector('#breadcrumb');
      if (breadcrumbElement) {
        document.getElementById('breadcrumb').innerHTML = breadcrumbElement.innerHTML;
      }

      const articleContent = mainContent.querySelector('.article') || mainContent;
      document.getElementById('article-content-container').innerHTML = articleContent.innerHTML;
      showContent('article-content');
    }

    function backToFeed() {
      if (currentFeed) loadFeedByUrl(currentFeed.feedUrl);
      else showHome();
    }
  </script>
</body>
</html>`;

export default function renderSpa() {
  return html;
}
