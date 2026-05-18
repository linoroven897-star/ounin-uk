const fs = require('fs');
const c = fs.readFileSync('C:/Users/Mayn/.openclaw/workspace/ounin-clone/index.html');
const s = c.toString('utf8');
let idx = s.indexOf('pro-embedded');
console.log('pro-embedded at:', idx);
console.log('context:', s.slice(idx-30, idx+80));
// find all data-name with product info
let m = s.match(/data-name="[^"]+"/g);
console.log('data-name matches:', m);