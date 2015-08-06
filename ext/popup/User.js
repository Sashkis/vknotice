/**
 * Класс пользователей
 * @constructor
 * @param {Oblect|Number} user_obj ID Уже загруженного пользователя или Объект пользователя загруженный через API
 * 
 * @property {Number}	id				ID пользователя
 * @property {String}	domain			Path на профиль 
 * @property {String}	first_name		Имя
 * @property {String}	last_name		Фамилия
 * @property {String}	name			Полное имя
 * @property {Boolean}	online			Онлайн статус пользователя
 * @property {Boolean}	online_app		Онлайн через приложение
 * @property {Boolean}	online_mobile	Онлайн через мобильный
 * @property {String}	photo_100		URL аватара
 * @property {String}	status			Статус пользователя
 * @property {Boolean}	notLoaded		Загружен ли пользователь
 */
function User (user_obj) {

	// Проверяем загружен ли искомый пользователь
	if (typeof user_obj === 'number') {
		var search_id = user_obj;
		if (window.Popup.profiles[search_id]) {
			$.extend(this, window.Popup.profiles[search_id]);
			return true;
		} else {
			console.warn('User not loaded: ' + search_id);
			window.Popup.callAPI('users.get', {
				context: this,
				data: {
					user_ids: search_id,
					fields: 'status,photo_100,domain,online'
				}, 
				done: function (API) {
					window.Popup.profiles[search_id] = new User(API[0]);
					this.upData();
				}
			});
			
			user_obj = {
				notLoaded: true,
				id: user_obj,
				domain: 'id' + user_obj
			};
		}
	}

	var VK = 'https://vk.com/';

	// Применяем свойства по-умолчанию
	$.extend(this, {
		'id': 0,
		'domain': '',
		'first_name': '',
		'last_name': '',
		'online': 0,
		'online_app': 0,
		'online_mobile': 0,
		'photo_100': 'img/camera_100.png',
		'status': '',
		'notLoaded': false,
	}, user_obj);
	this.status = this.status.escapeHtml();

	/**
	 * Полное Имя пользователя
	 * @type {String}
	 */
	this.name = this.first_name + ' ' + this.last_name;

	/**
	 * Ссылка на профиль пользователя
	 * @param  {String} ancor Текст ссылки
	 * @return {String}       HTML Код ссылки
	 */
	this.profileLink = function (ancor) {
		if (!ancor) {
			ancor = this.name;
		}
		return ancor.link(VK + this.domain, {class: 'profile'});
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
	this.ava = function (options) {
		options = $.extend({
			'title': false,
			'isLink': false,
			'size': 100,
			'marker': true,
			'type': 'full'
		}, options);

		var onlineClass = (!!this.online && options.marker ? ' online' : ''),
			imgHTML = '<div class="ava ava-' + options.type + onlineClass + '"><img title="' + (options.title ? this.name : '') + '" src="' + this.photo_100 + '" width="' + options.size + '" height="' + options.size + '"/></div>';

		if (options.isLink === true) return this.profileLink(imgHTML);
		else return imgHTML;
	};

	/**
	 * Добавляет или удаляет текущего пользователя из списка друзей
	 * @param {String}		method 	Метод для отправки
	 * @param {Function}	options	Ajax options
	 */
	this.addOrDel = function (method, options) {
		if (method !== 'add') {
			method = 'delete';
		}
		options.data = {
			user_id: this.id
		};
		window.Popup.callAPI('friends.' + method, options);
	};

	/**
	 * Обновляет текущий объект в соотведствии с глобальным значением в Popup 
	 * @example
	 * var user = new User(); // User {id: 0, name: "" ...}
	 * user.upData(1); // {id: 1, name: "Павел" ...}
	 */
	this.upData = function (user_id) {
		if (!user_id) {
			user_id = this.id;
		}
		if (window.Popup.profiles[user_id]) {
			$.extend(this, window.Popup.profiles[user_id]);
			if (this.jQ) {
				this.jQ.data(this);
			}
			this.notLoaded = false;
			console.info('User id' + user_id + ' was loaded');
		}
	};
}