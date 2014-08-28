var recolor = require('./index');
var assert = require('assert');
var chalk = require('chalk');

describe('recolor', function () {
    it('should work', function () {
        var source = 'foo\x1b[36m\x1b[4mbar\x1b[24m\x1b[39m';
        var target = recolor(source);
        var expect = 'foo\x1b[36m\x1b[4mbar\x1b[0m';

        assert.equal(target, expect);
    });

    it('should work when nesting colors', function () {
        var source = '\x1b[33mfoo\x1b[32mbar\x1b[39mbaz\x1b[39m';
        var target = recolor(source);
        var expect = '\x1b[33mfoo\x1b[0m\x1b[32mbar\x1b[0m\x1b[33mbaz\x1b[0m';

        assert.equal(target, expect);
    });

    it('should work when using chalk', function () {
        var source = chalk.blue('blue' + chalk.bgWhite.black('black') + 'blue');
        var target = recolor(source);
        var expect = '\x1b[34mblue\x1b[0m\x1b[30m\x1b[47mblack\x1b[0m\x1b[34mblue\x1b[0m';

        assert.equal(target, expect);
    });

    it('should work when recolor twice', function () {
        var source = 'foo\x1b[36m\x1b[4mbar\x1b[24m\x1b[39m';
        var target = recolor(recolor(source));
        var expect = 'foo\x1b[36m\x1b[4mbar\x1b[0m';

        assert.equal(target, expect);
    });

    it('should work when using blink', function () {
        var source = 'foo\x1b[5mbar\x1b[25mbaz';
        var target = recolor(source);
        var expect = 'foo\x1b[5mbar\x1b[0mbaz';

        assert.equal(target, expect);
    });
});
