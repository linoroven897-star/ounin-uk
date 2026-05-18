const fs = require('fs');
const c = fs.readFileSync('assets/css/critical.css', 'utf8');
const search = '.product-card:hover .product-img {';
let count = 0;
let idx = 0;
while ((idx = c.indexOf(search, idx)) !== -1) {
  count++;
  const pos = idx;
  idx += search.length;
  console.log('Found at', pos, 'total so far:', count);
}
console.log('Total occurrences:', count);
console.log('CSS length:', c.length);
