/* globals document, $, chrome, navigator, Vk, console, getCase*/
/*jshint esnext: true */
/*jshint -W097*/

"use strict";
/**
 * Класс пользователей
 * @constructor
 * @param {Oblect} user_obj Объект пользователя загруженный через API
 *
 * @property {Number}	id				ID пользователя
 * @property {String}	domain			Path на профиль
 * @property {String}	first_name		Имя
 * @property {String}	last_name		Фамилия
 * @property {String}	name			Полное имя
 * @property {Boolean}	online			Онлайн статус пользователя
 * @property {String}	photo_100		URL аватара
 * @property {String}	status			Статус пользователя
 */
function User (user_obj) {

	// Применяем свойства по-умолчанию
	$.extend(this, user_obj);

	// Полное Имя пользователя
	this.name = this.first_name + ' ' + this.last_name;
}

User.prototype.domain = 'https://vk.com/';
User.prototype.first_name = '';
User.prototype.last_name = '';
User.prototype.name = '';
User.prototype.photo_100 = 'img/camera_100.png';
User.prototype.status = '';


/**
 * Ссылка на профиль пользователя
 * @param  {String} ancor Текст ссылки
 * @return {String}       HTML Код ссылки
 */
User.prototype.profileLink = function (ancor) {
	return $('<a/>', {
		href: `https://vk.com/${this.domain}`,
		target: '_blank',
		'class': 'profile',
		html: ancor || this.name
	});
};

/**
 * Генерирует аватар пользователя
 * @param  {Object}		options			Параметры аватара
 * @param  {Boolean}	options.title	Вставлять ли атрибут title
 * @param  {Boolean}	options.isLink	Является ли аватар ссылкой
 * @param  {Number}		options.size 	Размер квадратного аватара
 * @param  {Boolean}	options.marker	Вставлять ли маркер "Онлайн"
 * @param  {String}		options.type	Тип аватара. Вставляется в атрибут class
 * @return {String}						HTML
 */
User.prototype.ava = function (options) {
	options = $.extend({
		'title': false,
		'isLink': false,
		'size': 100,
		'marker': true,
		'src': this.photo_100,
		'type': 'full',
	}, options);

	const $imgHTML = $('<div/>', {
		'class': `ava ava-${options.type} ${this.online && options.marker ? 'online' : ''}`,
		html: $('<img/>', {
			title: (options.title ? this.name : ''),
			src: options.src,
			width: options.size,
			height: options.size,
		})
	});

	if (options.isLink === true) return this.profileLink($imgHTML);
	else return $imgHTML;
};
