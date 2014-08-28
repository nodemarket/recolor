recolor [![NPM version](http://img.shields.io/npm/v/recolor.svg?style=flat-square)](https://npmjs.org/package/recolor) [![Build Status](http://img.shields.io/travis/nodemarket/recolor.svg?style=flat-square)](https://travis-ci.org/nodemarket/recolor) [![DevDependencies Status](http://img.shields.io/david/dev/nodemarket/recolor.svg?style=flat-square)](https://david-dm.org/nodemarket/recolor#info=devDependencies)
===

`recolor` is a terminal color formatter, supported nesting styles.

Why you need `recolor` ?

    pseudo code: [red]foo[green]bar[/green]baz[/red]
    source string: \x1b[31mfoo\x1b[32mbar\x1b[39mbaz\x1b[39m
    target string: \x1b[31mfoo\x1b[0m\x1b[32mbar\x1b[0m\x1b[31mbaz\x1b[0m

See the screenshot:

![screenshot](https://f.cloud.github.com/assets/157338/1850376/e8af5258-76cf-11e3-805d-b48dd4636acd.png)

## Installation

    $ npm install recolor

## Usage

```javascript
var recolor = require('recolor');

// source string
var source = '\x1b[31mfoo\x1b[32mbar\x1b[39mbaz\x1b[39m';

// using recolor
var target = recolor(source);
```

## License

MIT &copy; [Firede](https://github.com/firede)
