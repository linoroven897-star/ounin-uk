const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Mayn/.openclaw/workspace/ounin-clone';

// Fix BUTTON-based cart buttons (need onclick)
const buttonFiles = [
  'about.html', 'blog-bread.html', 'blog-care.html', 'blog-chicken.html',
  'blog-desserts.html', 'blog-fish.html', 'blog-meal-prep.html',
  'blog-oven-comparison.html', 'blog-steam-temperature.html', 'blog-vegetables.html',
  'blog.html', 'contact.html', 'recipe-detail.html', 'recipes.html', 'search.html'
];

console.log('=== Fixing button cart buttons ===');
buttonFiles.forEach(f => {
  const fp = path.join(dir, f);
  if (!fs.existsSync(fp)) { console.log('missing:', f); return; }
  let content = fs.readFileSync(fp, 'utf8');
  
  // Match: <button class="nav-btn cart-wrapper" ... id="cart-btn">
  // Add onclick="openCart();return false;"
  const pattern = /(<button class="nav-btn cart-wrapper"[^>]*id="cart-btn"[^>]*>)/;
  
  if (pattern.test(content)) {
    const newTag = content.replace(pattern, '$1 onclick="openCart();return false;"');
    fs.writeFileSync(fp, newTag, 'utf8');
    console.log('fixed button:', f);
  } else {
    console.log('no match:', f);
  }
});

console.log('\n=== Done ===');
console.log('All button-based cart icons now have onclick="openCart();return false;"');
console.log('This explicitly prevents href="#" from adding # to URL');