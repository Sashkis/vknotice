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
		jQuery.extend(true, this, {
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
				'v': '5.35'
			},
		}, params);
		
		$.ajaxSetup({
			data: this.api,
		});

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
		jQuery('#newmess #mCSB_2_container').attr('data-before', this.loc("Your private messages will be displayed here.", true));
		return true;
	},


	/**
	 * Применяет перевод
	 */
	loadTranslate: function () {
		jQuery('#menu li .i18n, .navbar-brand, .dropdown li a').text(function () {
			var title = Popup.loc($(this).text())
			if (title) {
				return title;
			}
		});

		jQuery('#newmess, #newfriends').attr('data-before', this.loc('Please inform the developers.', true));
		return true;
	},


	/**
	 * Активирует слайд-блоки
	 */
	initSlide: function () {
		return jQuery('.slide').on('click', function () {
			var target = jQuery(this).attr('data-target');
			if (target === '#' + jQuery('.slider.open').attr('id')) {
				target = '#friends-online';
			}
			jQuery('.slider.open').add('.slide.open').add(this).add(target).toggleClass('open');
			return false;
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
	buildCounters: function () {
		jQuery('#menu .counter').text(function () {
			var key = jQuery(this).parents('li').attr('id');
			
			if (Popup.counter[key]) {
				if (key === 'messages' && Popup.showMessage) {
					Popup.counter[key] = 0;
					for (var id in Popup.dialogs) {
						if (Popup.dialogs[id].unread) {
							Popup.counter[key] += Popup.dialogs[id].unread;
						}
					}
				}
				return '+' + Math.min(Popup.counter[key], 99);
			} else {
				return key === 'messages' ? '+' : ''
			}
		});
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
		jQuery('#my a.profile').attr('href', VK + this.current.domain);
		jQuery('header .profile').html((this.current.online ? '<i class="mark"></i>' : '') + this.current.name + this.current.ava({'isLink':false, 'marker':false, 'size':50}));
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
				frag.append(jQuery('<figure>' + user.profileLink(user.ava({marker: false}).icon('cancel', {title: this.loc('Remove', true)}) + ''.link(VK + 'im?sel=' + user.id, {class: 'icon-pencil'}) + '<figcaption>' + user.name + '</figcaption>') + '</figure>').data(user));
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
					cancelButton = ''.icon('cancel', {class: 'hovered', title: this.loc('Reject', true)}),
					addButton    = ''.icon('ok', {class: 'hovered', title: this.loc('Accept', true)});
					
				frag.append(jQuery('<figure user-id="' + user.id + '">' + cancelButton + addButton + user.ava({'isLink': true, 'size': 50}) + '<figcaption>' + user.profileLink() + '<span>' + user.status + '</span></figcaption></figure>').data(user));
			}, this);
		} else {
			jQuery('#friends .slide').add($newfriends).removeClass('open'); // Закрыть панель новых друзей
		}
		
		return $newfriends.html(frag);
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

			$newmess.html(frag).find('.body').linkify({
				format: function (value, type) {
					if (type === 'url' && value.length > 40) {
						value = value.substr(0, 40) + '…';
					}
					return value;
				}
			});

			if ($newmess.find('.dialog-unread').length > 0 && Popup.options.indexOf('messages') !== -1) {
				jQuery('#messages .slide').trigger('click');
			}
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
				header = this.loc(this.alerts[type].header, true);
				header = '<thead><tr><td>' + header + '</td></tr></thead>';
			}
			// Футер
			if (this.alerts[type].footer) {
				footer = this.loc(this.alerts[type].footer, true);
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
					text = this.loc(this.alerts[type].body.text, true);
					if (text) {
						text += '<br><br>';
					} else {
						text = '';
					}
				}

				if (this.alerts[type].body.ancor) {
					link = this.loc(this.alerts[type].body.ancor, true);
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
	 * @param  {String}  text 		 Строка для перевода.
	 * @param  {Boolean} isRequared  Возвращать строку или undefined
	 * @return {String|undefined}	 Строка перевода или undefined.
	 */
	loc: function (text, isRequared) {
		if (isRequared) {
			var def = text;
		} else {
			var def = undefined;
		}

		if (!text || !this.i18n) {
			return def;
		}

		if (this.i18n[text] && this.i18n[text][this.api.lang]) {
			return this.i18n[text][this.api.lang];
		} else {
			return def;
		}
	},

	/**
	 * Загружает ссылку "Поделится Вконтакте"
	 * @param  {Function} callback     Функция для обработки ссылки
	 * @param  {Object}   shareOptions Параметры ссылки "Поделится""
	 * @return {Boolean}               TRUE
	 */
	loadShareUrl: function (callback, shareOptions) {
		var port = chrome.runtime.connect({name: 'getShareUrl'});
		port.postMessage(shareOptions);
		port.onMessage.addListener(callback);
		return true;
	},

	/**
	 * @param {Boolean} commentHash Ссылка на коментарии
	 * @return {String} URL на страницу расширения
	 */
	getExtUrl: function (commentHash) {
		if (/(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)) {
			commentHash = commentHash ? '#feedback-container' : '';
			return 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin' + commentHash;
		} else {
			commentHash = commentHash ? '/reviews' : '';
			return 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn' + commentHash;
		}
	}
};