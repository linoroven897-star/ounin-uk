/**
 * blog-fetch.js
 * Fetches blog articles from Shopify Storefront API
 * and renders them into the blog page.
 */

(function () {
  'use strict';

  const CONFIG = {
    store: 'store.ouninshop.com',
    version: '2025-01',
    token: 'bcab446e8c15f2b13d67343f8f685539',
    blogHandle: 'news',
    articlesPerPage: 9
  };

  // GraphQL query to fetch articles
  const ARTICLES_QUERY = `{
    blog(handle: "${CONFIG.blogHandle}") {
      title
      articles(first: ${CONFIG.articlesPerPage}) {
        edges {
          node {
            title
            handle
            excerpt
            publishedAt
            image { url altText }
          }
        }
      }
    }
  }`;

  /**
   * Format date to readable string
   */
  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Convert relative URL path to full Shopify blog article URL
   * Handle is like "my-article-title" → /blogs/news/my-article-title
   */
  function getArticleUrl(handle) {
    return `https://store.ouninshop.com/blogs/${CONFIG.blogHandle}/${handle}`;
  }

  /**
   * Build article card HTML
   */
  function buildArticleCard(article) {
    const imageHtml = article.image
      ? `<div class="blog-card-image">
           <img src="${article.image.url}" alt="${article.image.altText || article.title}" loading="lazy">
         </div>`
      : '';

    const excerptHtml = article.excerpt
      ? `<p class="blog-card-excerpt">${article.excerpt}</p>`
      : '';

    return `
      <article class="blog-card">
        <a href="${getArticleUrl(article.handle)}" class="blog-card-link">
          ${imageHtml}
          <div class="blog-card-content">
            <time class="blog-card-date" datetime="${article.publishedAt}">
              ${formatDate(article.publishedAt)}
            </time>
            <h3 class="blog-card-title">${article.title}</h3>
            ${excerptHtml}
          </div>
        </a>
      </article>
    `;
  }

  /**
   * Render articles into a container element
   */
  function renderArticles(containerId, articles) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('[blog-fetch] Container not found:', containerId);
      return;
    }

    if (!articles || articles.length === 0) {
      container.innerHTML = '<p class="blog-empty">No articles yet.</p>';
      return;
    }

    container.innerHTML = articles.map(buildArticleCard).join('') +
      '<div class="blog-more-link"><a href="https://store.ouninshop.com/blogs/' + CONFIG.blogHandle + '" class="btn">View All Articles</a></div>';
  }

  /**
   * Fetch articles from Shopify Storefront API
   */
  async function fetchArticles() {
    try {
      const response = await fetch(`https://${CONFIG.store}/api/${CONFIG.version}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': CONFIG.token
        },
        body: JSON.stringify({ query: ARTICLES_QUERY })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('[blog-fetch] GraphQL errors:', data.errors);
        return null;
      }

      return data.data.blog.articles.edges.map(edge => edge.node);
    } catch (err) {
      console.error('[blog-fetch] Fetch failed:', err.message);
      return null;
    }
  }

  /**
   * Initialize blog fetching
   * Call this after DOM is ready, e.g.:
   *   document.addEventListener('DOMContentLoaded', () => initBlog('blog-articles-grid'));
   */
  async function initBlog(containerId) {
    const articles = await fetchArticles();
    if (articles !== null) {
      renderArticles(containerId, articles);
    }
  }

  // Expose globally
  window.ShopifyBlog = { fetchArticles, renderArticles, initBlog };
})();
