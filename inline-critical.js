const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('assets/css/critical.css', 'utf8');

console.log('HTML has critical.css:', html.includes('critical.css'));
console.log('CSS length:', css.length);

const result = html.replace(
  /\s*<link rel="stylesheet" href="assets\/css\/critical\.css">\s*\n/,
  '  <style>\n' + css + '\n  </style>\n'
);

console.log('Result length:', result.length, 'Original:', html.length);
fs.writeFileSync('index.html', result);
console.log('Written');
