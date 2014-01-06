var recolor = require('./index');

var source = '\x1b[31mfoo\x1b[32mbar\x1b[39mbaz\x1b[39m';
var target = recolor(source);

console.log('source string:', source);
console.log('target string:', target);
