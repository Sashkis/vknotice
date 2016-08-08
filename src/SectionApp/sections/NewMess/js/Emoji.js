var SectionsApp;
(function (SectionsApp) {
    var Emoji = (function () {
        function Emoji() {
            this.emojiCharSeq = /[0-9\uD83D\uD83C]/;
            this.emojiRegEx = /((?:[\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g;
            this.pathToEmojisImages = 'https://vk.com/images/emoji/';
        }
        Emoji.prototype.getEmojiHTML = function (code, symbol) {
            return "<img class=\"emoji\" " + (symbol ? "alt=\"" + symbol + "\"" : '') + " src=\"" + this.pathToEmojisImages + code + ".png\" />";
        };
        Emoji.prototype.emojiToHTML = function (str) {
            var _this = this;
            var regs = {
                'D83DDE07': /(\s|^)([0OО]:\))([\s\.,]|$)/g,
                'D83DDE09': /(\s|^)(;-\)+)([\s\.,]|$)/g,
                'D83DDE06': /(\s|^)([XХxх]-?D)([\s\.,]|$)/g,
                'D83DDE0E': /(\s|^)(B-\))([\s\.,]|$)/g,
                'D83DDE0C': /(\s|^)(3-\))([\s\.,]|$)/g,
                'D83DDE20': /(\s|^)(&gt;\()([\s\.,]|$)/g,
                'D83DDE30': /(\s|^)(;[oоOО])([\s\.,]|$)/g,
                'D83DDE33': /(\s|^)(8\|)([\s\.,]|$)/g,
                'D83DDE32': /(\s|^)(8-?[oоOО])([\s\.,]|$)/g,
                'D83DDE0D': /(\s|^)(8-\))([\s\.,]|$)/g,
                'D83DDE37': /(\s|^)(:[XХ])([\s\.,]|$)/g,
                'D83DDE28': /(\s|^)(:[oоOО])([\s\.,]|$)/g,
                '2764': /(\s|^)(&lt;3)([\s\.,]|$)/g,
                'D83DDE0A': /(:-\))([\s\.,]|$)/g,
                'D83DDE03': /(:-D)([\s\.,]|$)/g,
                'D83DDE1C': /(;-[PР])([\s\.,]|$)/g,
                'D83DDE0B': /(:-[pр])([\s\.,]|$)/g,
                'D83DDE12': /(:-\()([\s\.,]|$)/g,
                '263A': /(:-?\])([\s\.,]|$)/g,
                'D83DDE0F': /(;-\])([\s\.,]|$)/g,
                'D83DDE14': /(3-?\()([\s\.,]|$)/g,
                'D83DDE22': /(:&#039;\()([\s\.,]|$)/g,
                'D83DDE2D': /(:_\()([\s\.,]|$)/g,
                'D83DDE29': /(:\(\()([\s\.,]|$)/g,
                'D83DDE10': /(:\|)([\s\.,]|$)/g,
                'D83DDE21': /(&gt;\(\()([\s\.,]|$)/g,
                'D83DDE1A': /(:-\*)([\s\.,]|$)/g,
                'D83DDE08': /(\}:\))([\s\.,]|$)/g,
                'D83DDC4D': /(:like:)([\s\.,]|$)/g,
                'D83DDC4E': /(:dislike:)([\s\.,]|$)/g,
                '261D': /(:up:)([\s\.,]|$)/g,
                '270C': /(:v:)([\s\.,]|$)/g,
                'D83DDC4C': /(:ok:|:ок:)([\s\.,]|$)/g
            };
            for (var code in regs) {
                if (str.indexOf(code) > -1)
                    str = str.replace(regs[code], this.getEmojiHTML(code));
            }
            return str.replace(this.emojiRegEx, function (s) { return _this.emojiReplace(s); }).replace(/\uFE0F/g, '');
        };
        Emoji.prototype.emojiReplace = function (symbolstr) {
            var buffer = '';
            var altBuffer = '';
            var joiner = false;
            var isFlag = false;
            var out = '';
            var symbols = [];
            var codes = [];
            for (var i = 0; i < symbolstr.length; i++) {
                var num = symbolstr.charCodeAt(i);
                var code = num.toString(16).toUpperCase();
                var symbol = symbolstr.charAt(i);
                if (i === 1 && num === 8419) {
                    codes.push('003' + symbolstr.charAt(0) + '20E3');
                    symbols.push(symbolstr.charAt(0));
                    buffer = '';
                    altBuffer = '';
                    continue;
                }
                buffer += code;
                altBuffer += symbol;
                if (!symbol.match(this.emojiCharSeq)) {
                    codes.push(buffer);
                    symbols.push(altBuffer);
                    buffer = '';
                    altBuffer = '';
                }
            }
            if (buffer) {
                codes.push(buffer);
                symbols.push(altBuffer);
            }
            buffer = '';
            altBuffer = '';
            for (var i = 0; i < codes.length; i++) {
                var code = codes[i];
                var symbol = symbols[i];
                if (symbol.match(/\uD83C[\uDFFB-\uDFFF]/)) {
                    buffer += code;
                    altBuffer += symbol;
                    continue;
                }
                if (joiner) {
                    buffer += code;
                    altBuffer += symbol;
                    joiner = false;
                    continue;
                }
                if (code === '200C' || code === '200D') {
                    if (buffer) {
                        joiner = true;
                        continue;
                    }
                    else {
                        out += symbol;
                    }
                }
                if (symbol.match(/\uD83C[\uDDE6-\uDDFF]/)) {
                    if (isFlag) {
                        buffer += code;
                        altBuffer += symbol;
                        isFlag = false;
                        continue;
                    }
                    isFlag = true;
                }
                else if (isFlag) {
                    isFlag = false;
                }
                if (buffer) {
                    out += this.getEmojiHTML(buffer, altBuffer);
                }
                buffer = code;
                altBuffer = symbol;
            }
            if (buffer) {
                out += this.getEmojiHTML(buffer, altBuffer);
            }
            return out;
        };
        return Emoji;
    }());
    SectionsApp.Emoji = Emoji;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=Emoji.js.map