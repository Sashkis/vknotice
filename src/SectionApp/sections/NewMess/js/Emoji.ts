module SectionsApp {
	export class Emoji {
		emojiCharSeq = /[0-9\uD83D\uD83C\uD83E]/;
		emojiRegEx = /((?:[\u203C\u2049\u2122\u2328\u2601\u260E\u261d\u2626\u262A\u2638\u2639\u263a\u267B\u267F\u2702\u2708]|[\u2600\u26C4\u26BE\u2705\u2764]|[\u2194-\u2199\u21AA\u21A9]|[\u231A-\u231B]|[\u23E9-\u23EF]|[\u23F0-\u23F4]|[\u23F8-\u23FA]|[\u24C2]|[\u25AA-\u25AB]|[\u25B6\u25C0]|[\u25FB-\u25FE]|[\u2602-\u2618]|[\u2648-\u2653]|[\u2660-\u2668]|[\u26A0-\u26FA]|[\u2692-\u269C]|[\u262E-\u262F]|[\u2622-\u2623]|[\u2709-\u2764]|[\u2795-\u2797]|[\u27A1]|[\u27BF]|[\u2934-\u2935]|[\u2B05-\u2B07]|[\u2B1B]|[\u2B50\u2B55]|[\u303D]|[\u3297\u3299]|[\uE000-\uF8FF]|[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]|[0-9]\u20E3|[\u0023-\u0039\u203C-\u21AA]\uFE0F\u20E3|[\u200C\u200D])+)/g;
		/**
		* Путь до директории с изображениями смайликов
		* @type {String}
		*/
		pathToEmojisImages = 'https://vk.com/images/emoji/';

		/**
		* @param  String code   Код символа
		* @param  String symbol Сам символ
		* @return String        HTML код картинки
		*/
		getEmojiHTML(code: string, symbol?: string) {
			return `<img class="emoji" ${symbol ? `alt="${symbol}"` : ''} src="${this.pathToEmojisImages}${code}.png" />`;
		}
		/**
		* Преобразует символы смайликов в строке в соотведствующие изображения
		* @param  {String} str Строка для преобразования
		* @return {String}     Изменённая строка
		*/
		emojiToHTML(str: string) {
			if (!str || typeof str != 'string') return str;
		  // str = str.replace(/&nbsp;/g, ' ').replace(/<br>/g, "\n");
		  let regs: Object = {
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
		    '2764': /(\s|^)(&lt;3)([\s\.,]|$)/g
		  };

	    for (var code in regs) {
	      str = str.replace(regs[code], (match, pre, smile, space) => (pre || '') + this.getEmojiHTML(code)+(space || ''));
	    }

		  regs = {
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
		    //'D83DDE15': /(:\\)([\s\.,]|$)/g,
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
		    str = str.replace(regs[code], (match, smile, space) => this.getEmojiHTML(code)+(space || ''));
		  }

	    str = str.replace(this.emojiRegEx, (s:string) => this.emojiReplace(s));

		  return str;
		};

		/**
		* Подбирает коды к найденным символам
		* @param  String symbolstr Символ для замены
		*/
		emojiReplace(symbolstr: string) {
			let buffer = '';
			let altBuffer = '';
			let joiner = false;
			let isFlag = false;
			let out = '';

			const symbols: string[] = [];
			const codes: string[] = [];


			for (let i = 0; i < symbolstr.length; i++) {
				const num = symbolstr.charCodeAt(i);
				const code = num.toString(16).toUpperCase();
				const symbol = symbolstr.charAt(i);

				if (i === 1 && num === 8419) {
					codes.push('003'+symbolstr.charAt(0)+'20E3');
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

			for (let i = 0; i < codes.length; i++) {
				const code = codes[i];
				const symbol = symbols[i];
				if (symbol.match(/\uD83C[\uDFFB-\uDFFF]/)) { // colors
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
				if (code === '200C' || code === '200D') { // joiners
					if (buffer) {
						joiner = true;
						continue;
					} else {
						out += symbol;
					}
				}
				if (symbol.match(/\uD83C[\uDDE6-\uDDFF]/)) { // flags
					if (isFlag) {
						buffer += code;
						altBuffer += symbol;
						isFlag = false;
						continue;
					}
					isFlag = true;
				} else if (isFlag) {
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
		}
	}
}
