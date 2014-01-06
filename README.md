recolor [![Build Status](https://travis-ci.org/firede/recolor.png)](https://travis-ci.org/firede/recolor) [![DevDependencies Status](https://david-dm.org/firede/recolor/dev-status.png)](https://david-dm.org/firede/recolor#info=devDependencies)
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

---

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/firede/recolor/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
