const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove ALL product-actions divs (quick-view + wishlist buttons across all products)
let count = 0;
html = html.replace(/<div class="product-actions">\s*<button[^>]*>[\s\S]*?<\/button>\s*<\/div>\n?\s*/g, () => {
  count++;
  return '';
});
console.log(`Removed ${count} product-actions blocks`);
fs.writeFileSync('index.html', html);
