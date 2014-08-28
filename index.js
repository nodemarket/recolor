/**
 * recolor
 * 
 * Copyright (c) 2014 Firede. (MIT Licensed)
 * https://github.com/nodemarket/recolor
 */

/**
 * Codes
 */
var codes = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    blink: [5, 25],
    inverse: [7, 27],
    conceal: [8, 28],
    strikethrough: [9, 29],

    color: [
        function (n) {
            return (n >= 30 && n <= 37) || (n >= 90 && n <= 97);
        },
        39
    ],

    bgColor: [
        function (n) {
            return (n >= 40 && n <= 47) || (n >= 100 && n <= 107);
        },
        49
    ]
};

/**
 * Rules
 * 
 * @namespace
 */
var rules = {
    global: /(\x1b\[\d{1,3}m)/,
    item: /^\x1b\[(\d{1,3})m$/
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

        if (cap = rules.item.exec(item)) {
            var curCode = parseInt(cap[1], 10);

            Object.keys(codes).some(function(key) {
                var values = codes[key];
                var valOpen = values[0];
                var valClose = values[1];
                var node;

                if (curCode === 0) {
                    node = 'reset';
                }
                else if (typeof valOpen === 'number' && valOpen === curCode) {
                    node = 'open';
                }
                else if (typeof valOpen === 'function' && valOpen(curCode)) {
                    node = 'open';
                }
                else if (valClose === curCode) {
                    node = 'close';
                }

                if (node) {
                    tokens.push({
                        node: node,
                        type: key,
                        value: curCode,
                        raw: cap[0]
                    });
                    return true;
                }
            });
        }
        else {
            tokens.push({
                node: 'text',
                raw: item
            });
        }
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
