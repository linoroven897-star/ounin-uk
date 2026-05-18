const fs = require('fs');
const c = fs.readFileSync('C:/Users/Mayn/.openclaw/workspace/ounin-clone/index.html');
let s = c.toString('utf8');
// Fix the garbled data-name for product 1 (18in)
s = s.replace('data-name="Steam Combi Oven (18�?"', 'data-name="Steam Combi Oven (18in)"');
fs.writeFileSync('C:/Users/Mayn/.openclaw/workspace/ounin-clone/index.html', s, 'utf8');
console.log('done');

// verify
const c2 = fs.readFileSync('C:/Users/Mayn/.openclaw/workspace/ounin-clone/index.html');
const s2 = c2.toString('utf8');
let m = s2.match(/data-name="[^"]+"/g);
console.log('data-name matches:', m);