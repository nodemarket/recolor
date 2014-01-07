/**
 * recolor
 * 
 * Copyright (c) 2014 Firede. (MIT Licensed)
 * https://github.com/firede/recolor
 */

/**
 * Rules
 * 
 * @namespace
 */
var rules = {
    global: /(\x1b\[\d{1,3}m)/,

    reset: /^\x1b\[0m$/,

    color_open: /^\x1b\[(3[0-7]|9[0-7])m$/,
    color_close: /^\x1b\[39m$/,
    bg_color_open: /^\x1b\[(4[0-7]|10[0-7])m$/,
    bg_color_close: /^\x1b\[49m$/,

    bold_open: /^\x1b\[1m$/,
    bold_close: /^\x1b\[22m$/,
    italic_open: /^\x1b\[3m$/,
    italic_close: /^\x1b\[23m$/,
    underline_open: /^\x1b\[4m$/,
    underline_close: /^\x1b\[24m$/,
    blink_open: /^\x1b\[5m$/,
    blink_close: /^\x1b\[25m$/,
    inverse_open: /^\x1b\[7m$/,
    inverse_close: /^\x1b\[27m$/,
    strikethrough_open: /^\x1b\[9m$/,
    strikethrough_close: /^\x1b\[29m$/
};

/**
 * Style Stack
 * 
 * @constructor
 */
function StyleStack() {
    this.stack = [];
}

StyleStack.prototype.push = function (item) {
    return this.stack.push(item);
};

StyleStack.prototype.pop = function () {
    return this.stack.pop();
};

StyleStack.prototype.empty = function () {
    this.stack = [];
};

StyleStack.prototype.getLast = function () {
    return this.stack[this.stack.length - 1];
};

StyleStack.prototype.getNesting = function () {
    var hitTokens = [];
    var hitTypes = [];

    for (var i = this.stack.length - 1; i >= 0; --i) {
        var token = this.stack[i];
        var type = token.type;

        if (hitTypes.indexOf(type) === -1) {
            hitTokens.push(token);
            hitTypes.push(type);
        }
    }

    return hitTokens.reverse();
};

/**
 * Lexer
 * 
 * @param {string} text
 * @return {Array}
 */
function lexer (text) {
    var source = text.split(rules.global);
    var tokens = [];
    var cap;
    var item;

    for (var i = 0, len = source.length; i < len; i++) {
        item = source[i];

        if (!item) {
            continue;
        }

        if (cap = rules.color_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'color',
                value: cap[1],
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.color_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'color',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.bg_color_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'bg_color',
                value: cap[1],
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.bg_color_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'bg_color',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.bold_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'bold',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.bold_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'bold',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.italic_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'italic',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.italic_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'italic',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.underline_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'underline',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.underline_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'underline',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.blink_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'blink',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.blink_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'blink',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.inverse_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'inverse',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.inverse_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'inverse',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.strikethrough_open.exec(item)) {
            tokens.push({
                node: 'open',
                type: 'strikethrough',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.strikethrough_close.exec(item)) {
            tokens.push({
                node: 'close',
                type: 'strikethrough',
                raw: cap[0]
            });
            continue;
        }

        if (cap = rules.reset.exec(item)) {
            tokens.push({
                node: 'reset',
                raw: cap[0]
            });
            continue;
        }

        tokens.push({
            node: 'text',
            raw: item
        });
    }

    return tokens;
}

/**
 * format text by style tokens
 * 
 * @param {string} text
 * @param {Array} tokens
 * @return {string}
 */
function formatText(text, tokens) {
    if (!tokens || tokens.length === 0) {
        return text;
    }

    var prefix = '';
    var suffix = '\x1b[0m';

    tokens.forEach(function(token) {
        prefix += token.raw;
    });

    return prefix + text + suffix;
}

/**
 * Parser
 * 
 * @param {Array} tokens
 * @return {string}
 */
function parser (tokens) {
    var output = [];
    var stack = new StyleStack();
    var token;

    for (var i = 0, len = tokens.length; i < len; i++) {
        token = tokens[i];

        switch (token.node) {
            case 'text':
                var nestingTokens = stack.getNesting();
                var str = formatText(token.raw, nestingTokens);

                output.push(str);
                break;

            case 'open':
                stack.push(token);
                break;

            case 'close':
                var last = stack.getLast();

                if (token.type === last.type) {
                    stack.pop();
                }

                break;

            case 'reset':
                stack.empty();
        }
    }

    return output.join('');
}

/**
 * recolor
 * 
 * @param {string} text
 * @return {string}
 */
function recolor (text) {
    var tokens = lexer(text);
    var output = parser(tokens);

    return output;
}

module.exports = recolor;
