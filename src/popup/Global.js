/* globals $, chrome, navigator, console*/
/*jshint esnext: true */

/**
 * Екранирует HTML
 * @return {String}	Преобразованная строка
 */
String.prototype.escapeHtml = function () {
	'use strict';
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
	const app = new App();
	const now = new Date();
	const ago = (now.getTime() - this.getTime())/1000; // Количество секунд прошедших с момента публикации
	if (ago < 10)		  return app.loc('just now');
	else if (ago < 60)	  return `${getCase(Math.floor(ago), app.loc('seconds'))} ${app.loc('ago')}`;
	else if (ago < 3600)  return `${getCase(Math.floor(ago/60), app.loc('minutes'))} ${app.loc('ago')}`;
	else if (ago < 10800) return `${getCase(Math.floor(ago/3600), app.loc('hours'))} ${app.loc('ago')}`;
	else {
		const h = this.getHours()	< 10 ? `0${this.getHours()}`   : this.getHours();
		const m = this.getMinutes() < 10 ? `0${this.getMinutes()}` : this.getMinutes();
		const at = `${app.loc('at')} ${h}:${m}`;
		if (ago < 172800) {
			return `${app.loc(this.getDate() === now.getDate() ? 'today' : 'tomorrow')} ${at}`;
		} else {
			const y = this.getFullYear() != now.getFullYear() ? this.getFullYear() : '';
			return `${this.getDate()} ${app.loc('months')[this.getMonth()]} ${y} ${at}`;
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
	return number!==0? `${number} ${words[number%10===1&&number%100!==11?0:number%10>=2&&number%10<=4&&(number%100<10||number%100>=20)?1:2]}` : '';
}
