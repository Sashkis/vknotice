/* globals $, chrome, navigator, console*/
/*jshint esnext: true */

/**
 * Екранирует HTML
 * @return {String}	Преобразованная строка
 */
String.prototype.escapeHtml = function () {
	"use strict";
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return this.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Формат даты Вконтакте
 * @return {String}
 */
Date.prototype.toStringVkFormat = function () {
	"use strict";
	const now = new Date();
	const ago = (now.getTime() - this.getTime())/1000; // Количество секунд прошедших с момента публикации
	if (ago < 10)		  return Popup.loc('just now');
	else if (ago < 60)	  return getCase(Math.floor(ago),		Popup.loc('seconds')) + '&nbsp' + Popup.loc('ago');
	else if (ago < 3600)  return getCase(Math.floor(ago/60),	Popup.loc('minutes')) + '&nbsp' + Popup.loc('ago');
	else if (ago < 10800) return getCase(Math.floor(ago/3600),	Popup.loc('hours'))	 + '&nbsp' + Popup.loc('ago');
	else {
		const h = this.getHours()	< 10 ? '0' + this.getHours()   : this.getHours();
		const m = this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes();
		if (ago < 86400) {
			return Popup.loc('today')	+ '&nbsp' + Popup.loc('at') + '&nbsp' + h + ':' + m;
		} else if (ago < 172800) {
			return Popup.loc('tomorrow') + '&nbsp' + Popup.loc('at') + '&nbsp' + h + ':' + m;
		} else {
			const y = this.getFullYear() != now.getFullYear() ? '&nbsp' + this.getFullYear() : '';
			return this.getDate() + '&nbsp' + Popup.loc('months')[this.getMonth()] + y + '&nbsp' + Popup.loc('at') + '&nbsp' + h + ':' + m;
		}
	}
};

/**
 * Возвращает правильный падеж фразы
 * @param  {Number}	number	число
 * @param  {Array}	words	массив фраз
 * @return {String}			строка
 * @example
 * getCase(5, [слово, слова, слов]); // "5 слов"
 */
function getCase (number, words) {
	"use strict";
	return number!==0? number + '&nbsp' + words[number%10===1&&number%100!==11?0:number%10>=2&&number%10<=4&&(number%100<10||number%100>=20)?1:2] : "";
}
