var VK = 'https://vk.com/';

/**
 * Popup
 * @class
 */
var Popup = {

	/**
	 * Инициализирует свойства Popup
	 * @param  {Object} params Параметры из chrome.storage
	 */
	init: function (params) {
		params = jQuery.extend(true, {
			'audio': true,
			'counter': [],
			'friends': [],
			'dialogs': [],
			'newfriends': [],
			'profiles': [],
			'options': 'friends,photos,videos,messages,groups,notifications',
			'api': {
				'access_token': '',
				'user_id': '',
				'lang': 0,
				'v': '5.34'
			},
		}, params);
		for (var p in params) {
			this[p] = params[p];
		}

		var profCash = this.profiles;
		this.profiles = {};
		profCash.forEach(function (user_obj) {
			var user = new User(user_obj);
			this.profiles[user.id] = user;
		}, this);
		this.profiles.length = profCash.length;
	},

	/**
	 * Ображение к API Вконтакте
	 * @param  {String}   method  Метод к которому ображаемся
	 * @param  {Object}   options Параметры передаваемые в API ВК
	 * @param  {Function} done    Функция выполнемая в случае успешного выполнения метода
	 * @param  {Function} fail    Функция выполнемая в случае ошибки выполнения метода
	 * @param  {Function} always  Функция выполнемая всегда
	 */
	callAPI: function (method, options, done, fail, always) {
		options = jQuery.extend(this.api, options);

		jQuery.getJSON('https://api.vk.com/method/' + method, options)
			.done(function (API) {
				if (API.response !== undefined) {
					if (done !== undefined) {
						done.call(this, API.response);
					}
				} else {
					if (fail !== undefined) {
						fail.call(this, API);
					}
				}
			}.bind(this))
			.fail(function () {
				if (fail !== undefined) {
					fail.call(this);
				}
			}.bind(this))
			.always(function () {
				if (always !== undefined) {
					always.call(this);
				}
			}.bind(this));
	},
	

	/**
	 * Инициализирует плагин для скролбара 
	 * @param  {Object} options Опции передаваемые для плагина mCustomScrollbar
	 */
	buildCustomScrollbar: function (options) {
		options = jQuery.extend(true, {
			axis: 'y',
			autoHideScrollbar: true,
			alwaysShowScrollbar: 0,
			contentTouchScroll: false,
			theme: "dark-thin",
			scrollbarPosition: 'inside',
			scrollInertia: 150,
			keyboard: {enable: false},
			mouseWheel: {
				scrollAmount: 61
			}
		}, options);
		jQuery("#newmess, #newfriends").mCustomScrollbar(options);
		jQuery('#newmess #mCSB_2_container').attr('data-before', this.i18n.attr.no_mess);
	},


	/**
	 * Применяет перевод
	 */
	loadTranslate: function () {
		jQuery('.navbar-brand').text(this.i18n.global.title)
		jQuery('#menu li').each(function (i, el) {
			jQuery(el).find(".i18n").text(this.geti18n(jQuery(el).attr('id'), 'menu'));
		}.bind(this));
		// Системное меню
		jQuery('.dropdown li a').each(function (i, el) {
			jQuery(el).text(this.geti18n(jQuery(el).attr('data-i18n'), 'dropdown'));
		}.bind(this));

		jQuery('#newmess, #newfriends').attr('data-before', this.i18n.attr.error);
	},


	/**
	 * Активирует слайд-блоки
	 */
	initSlide: function () {
		jQuery('.slide').on('click', function () {
			var target = jQuery(this).attr('data-target');
			if (target === '#' + jQuery('.slider.open').attr('id')) {
				target = '#friends-online';
			}
			jQuery('.slider.open').add('.slide.open').add(this).add(target).toggleClass('open');
			return false;
		});
	},


	/**
	 * Активирует опции. Назначает события для переключения опций.
	 */
	initOptions: function () {
		// Опция аудио
		if (this.audio === true) {
			jQuery('#sysAudio').addClass('on');
		}
		if (this.showMessage === true) {
			jQuery('#sysShowMessage').addClass('on');
		}
		jQuery('.sys_opt').on('click', function () {
			jQuery(this).toggleClass('on off');
			var option = {};
			option[jQuery(this).attr('name')] = jQuery(this).hasClass('on');
			chrome.storage.local.set(option);
		});

		// Опции уведомлений
		// Инициализация
		jQuery('.api_opt').each(function (i, el) {
			if (window.Popup.options.indexOf(jQuery(el).attr('name')) >= 0) {
				jQuery(el).addClass('on');
			} else {
				jQuery(el).addClass('off');
			}
		});
		
		// Событие переключения
		jQuery('.api_opt').on('click', function () {
			jQuery(this).toggleClass('on off');
			var new_options = '';
			jQuery('.api_opt.on').each(function (i, el) {
				new_options += jQuery(el).attr('name') + ',';
			});
			// Сохранение нового значения
			window.Popup.options = new_options;
			chrome.storage.local.set({'options': new_options });
		});
	},


	/**
	 * Обращается к методу статистики 
	 */
	addVisitor: function () {
		this.callAPI('stats.trackVisitor');
	},


	/**
	 * Вставляет счетчики в меню 
	 */
	builCounters: function () {
		jQuery('#menu .counter').text(function (index, value) {
			if (jQuery(this).attr('data-target') === '#newmess') {
				return '+';
			} else {
				return '';
			}
		});

		if (Object.prototype.toString.call(this.counter) !== '[object Array]') {
			for (var key in this.counter) {
				if (key === 'messages' && this.showMessage) {
					var summ = 0, id;
					for (id in this.dialogs) {
						if (this.dialogs[id].unread) {
							summ += this.dialogs[id].unread;
						}
					}
					this.counter[key] = summ;
				}
				if (this.counter[key] > 0) {
					jQuery('#' + key + ' span.counter').text('+' + this.counter[key]);
				}
			}
		}
	},

	/**
	 * Удаляет предзагрущик 
	 * @return {jQuery} .wraper
	 */
	show: function () {
		return jQuery('.wraper.show').removeClass('show');
	},

	/**
	 * Инициализирует активный профиль. Вставляет информацию о провиле
	 * @return {jQuery} header
	 */
	setCurrentProfile: function () {
		this.current = new User(this.api.user_id-0);
		jQuery('#my a.profile').attr('href', VK+this.current.domain);
		jQuery('header .profile').html(this.current.name + this.current.ava({'isLink':false, 'marker':false, 'size':50}));
	},

	/**
	 * Строит 7 друзей онлайн. Седьмой скрыт.
	 * @return {jQuery} #right
	 */
	builFriendsOnline: function () {
		var frag = jQuery(document.createDocumentFragment());
		if (this.friends.length > 0) {
			this.friends.forEach(function (user_id) {
				var user = new User(user_id);
				frag.append(jQuery('<figure>' + user.profileLink(user.ava({marker: false}).icon('cancel', {title: this.i18n.attr.delete}) + ''.link(VK + 'im?sel=' + user.id, {class: 'icon-pencil'}) + '<figcaption>' + user.name + '</figcaption>') + '</figure>').data(user));
			}, this);
		}
		return jQuery('#friends-online').html(frag);
	},

	/**
	 * Строит заявки в друзья
	 * @return {jQuery} #newfriends
	 */
	buildNewFriends: function () {
		var $newfriends = jQuery('#newfriends'),
			frag = jQuery(document.createDocumentFragment());

		if (this.newfriends.length > 0) {

			this.newfriends.forEach(function (user_id) {
				var user = new User(user_id),
					cancelButton = ''.icon('cancel', {class: 'hovered', title: this.i18n.attr.remove}),
					addButton    = ''.icon('ok', {class: 'hovered', title: this.i18n.attr.add});
					
				frag.append(jQuery('<figure user-id="' + user.id + '">' + cancelButton + addButton + user.ava({'isLink': true, 'size': 50}) + '<figcaption>' + user.profileLink() + '<span>' + user.status + '</span></figcaption></figure>').data(user));
			}, this);
		} else {
			jQuery('#friends .slide').add($newfriends).removeClass('open'); // Закрыть панель новых друзей
		}
		$newfriends.html(frag);
	},

	/**
	 * Строит диалоги. Если есть не активные диалоги - открывает панель диалогов. 
	 * @return {jQuery} #newmess
	 */
	buildDialogs: function () {
		var $newmess = jQuery('#newmess');

		if (this.dialogs.length > 0) {
			var frag = jQuery(document.createDocumentFragment()),
				dialogCash = [], i;
			for (i = this.dialogs.length; i--;) {
				dialogCash.push(new Dialog(this.dialogs[i]));
			};
			this.dialogs = [];
			for (i = dialogCash.length; i--;) {
				this.dialogs[dialogCash[i].id] = dialogCash[i];
				this.dialogs[dialogCash[i].id].construct().prependTo(frag);
			};

			$newmess.html(frag);

			if ($newmess.find('.dialog-unread').length > 0 && Popup.options.indexOf('messages') !== -1) {
				jQuery('#messages .slide').trigger('click');
			}

			$newmess.find('.body').linkify({
				format: function (value, type) {
					if (type === 'url' && value.length > 40) {
						value = value.substr(0, 40) + '…';
					}
					return value;
				}
			});
		}

		return $newmess;
	},

	/**
	 * Строит Всплывающее сообщение
	 * @return {Boolean} Загружено ли сообщение об ошибке. TRUE - Просто сообщение. FALSE - Была ошибка.
	 */
	buildAlert: function () {
		jQuery('body').removeClass('grayscale');
		if (this.alerts === undefined || (this.alerts.error === false && this.alerts.message === false)) {
			return true;
		}
		if (this.alerts.error) {
			var type = 'error';
		} else {
			var type = 'message';
		}

		if (this.alerts[type].body.text === 'connect_error') {
			jQuery('body').addClass('grayscale');
			return true;
		} else {
			// Инициализация
			var header = '<thead><tr><td></td></tr></thead>',
				footer = '',
				image  = '',
				text   = '',
				link   = '';
			// Шапка
			if (this.alerts[type].header) {
				header = this.geti18n(this.alerts[type].header, 'alerts');
				header = '<thead><tr><td>' + header + '</td></tr></thead>';
			}
			// Футер
			if (this.alerts[type].footer) {
				footer = this.geti18n(this.alerts[type].footer, 'alerts');
				footer = '<tfoot><tr><td><a href="#">' + footer + '</a></td></tr></tfoot>';
			}
			// Изображение, Тело и ссылка
			if (this.alerts[type].body) {
				if (this.alerts[type].body.img) {
					image = '<img src="' + this.alerts[type].body.img + '">';
					if (this.alerts[type].body.imgLink) {
						image = image.link(this.alerts[type].body.imgLink, {class: 'imgLink'});
					}
					image += '<br>';
				} else {
					image = '';
				}

				if (this.alerts[type].body.text) {
					text = this.geti18n(this.alerts[type].body.text, 'alerts');
					if (text) {
						text += '<br><br>';
					} else {
						text = '';
					}
				}

				if (this.alerts[type].body.ancor) {
					link = this.geti18n(this.alerts[type].body.ancor, 'alerts');
					if (link) {
						link = link.link(this.alerts[type].body.url).bold();
					} else {
						link = '';
					}
				}
				text = '<tbody><tr><td>' + image + text + link + '</td></tr></tbody>';
			}
			var $alert = jQuery('#alert');	
			$alert.addClass('show').find('table').html(header + text + footer);

			$alert.one('click', 'a', function () {
				$alert.removeClass('show');
				this.alerts[type] = false;
				chrome.storage.local.set({'alerts': this.alerts});
			}.bind(this));

			return type !== 'error';
		}
	},

	/**
	 * Возвращает строку перевода
	 * @param  {String} text Строка для перевода.
	 * @example
	 * // Popup.geti18n("menu.setings");
	 * @param  {String} obj  Объект в котором искать строку. В случае, если в @param text он не указан
	 * @example
	 * // Popup.geti18n("setings", "menu");
	 * @return {String}      Строка перевода или строка поиска, если перевод не найден.
	 */
	geti18n: function (text, obj) {
		if (!obj) {
			var obj = text.split('.');
		} else {
			obj = [obj, text];
		}

		if (!this.i18n) {
			console.error('i18n not init');
			return obj[1];
		}
		if (this.i18n[obj[0]] && this.i18n[obj[0]][obj[1]]) {
			return this.i18n[obj[0]][obj[1]];
		} else {
			console.error('Undefined translate: ' + obj[0] + '.' + obj[1]);
			return obj[1];
		}
	},

	/**
	 * Загружает ссылку "Поделится Вконтакте"
	 * @param  {Function} callback     Функция для обработки ссылки
	 * @param  {Object}   shareOptions Параметры ссылки "Поделится""
	 * @return {String}                URL
	 */
	loadShareUrl: function (callback, shareOptions) {
		var port = chrome.runtime.connect({name: 'getShareUrl'});
		port.postMessage(shareOptions);
		port.onMessage.addListener(callback);
		return true;
	},

	/**
	 * @return {String} URL на страницу расширения
	 */
	getExtUrl: function () {
		if (/(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)) {
			return 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin';
		} else {
			return 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn';
		}
	},
}