const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Mayn/.openclaw/workspace/ounin-clone';
const files = ['account.html', 'cart.html'];

files.forEach(f => {
  const fp = path.join(dir, f);
  let c = fs.readFileSync(fp, 'utf8');
  c = c.replace(/href="#" class="nav-btn cart-wrapper"/g, 'href="javascript:void(0)" class="nav-btn cart-wrapper"');
  fs.writeFileSync(fp, c, 'utf8');
  console.log('fixed:', f);
});