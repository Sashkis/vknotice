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
		$.extend(true, this, {
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
	 * Обращение у ВК API
	 * @param  {String}	method	Метод API
	 * @param  {Object}	options	Параметры запроса
	 * @see  http://api.jquery.com/jQuery.ajax
	 */
	callAPI: function (method, options) {
		if (typeof method !== 'string') {
			options = method;
			method = options.url;
		} else if (options === undefined) {
			options = {};
		}

		$.ajax($.extend(true, {
			url: 'https://api.vk.com/method/' + method,
			context: this,
			dataType: "json",
			data: this.api,
			timeout: 10000
		}, options))
		// Обработка удачного запроса
		.done(function (API) {
			if (API.response !== undefined) {
				if (options.done) {
					options.done.call(this, API.response);
				}
			} else {
				console.error(method + ' api error: ' + API.error.error_code + '. ' + API.error.error_msg);
				if (options.fail) {
					options.fail.call(this, API);
				}
			}
		})
		// Обработка ошибки запроса
		.fail([function (jqxhr) {
			console.error(method + ' ajax error; readyState:' + jqxhr.readyState + '; status:' + jqxhr.status + '; statusText:' + jqxhr.statusText);
		}, options.fail])
		// Всегда
		.always(options.always);
	},
	

	/**
	 * Инициализирует плагин для скролбара 
	 * @param  {Object} options Опции передаваемые для плагина mCustomScrollbar
	 */
	buildCustomScrollbar: function (options) {
		options = $.extend(true, {
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
		$("#newmess, #newfriends").mCustomScrollbar(options);
		$('#newmess #mCSB_2_container').attr('data-before', this.loc("Your private messages will be displayed here."));
		return true;
	},


	/**
	 * Применяет перевод
	 */
	loadTranslate: function () {
		$('#menu li .i18n, .navbar-brand, .dropdown li a').text(function (index, value) {
			return Popup.loc(value, false);
		});

		$('#newmess, #newfriends').attr('data-before', function (index, value) {
			return Popup.loc(value, false);
		});

		return true;
	},


	/**
	 * Активирует слайд-блоки
	 */
	initSlide: function () {
		return $('.slide').on('click', function () {
			var target = $(this).attr('data-target');
			if (target === '#' + $('.slider.open').attr('id')) {
				target = '#friends-online';
			}
			$('.slider.open').add('.slide.open').add(this).add(target).toggleClass('open');
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
		$('#menu .counter').text(function () {
			var key = $(this).parents('li').attr('id');
			
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
		return $('.wraper.show').removeClass('show');
	},

	/**
	 * Инициализирует активный профиль. Вставляет информацию о провиле
	 * @return {jQuery} header
	 */
	setCurrentProfile: function () {
		this.current = new User(this.api.user_id-0);
		$('#my a.profile').attr('href', VK + this.current.domain);
		$('header .profile').html((this.current.online ? '<i class="mark"></i>' : '') + this.current.name + this.current.ava({'isLink':false, 'marker':false, 'size':50}));
	},

	/**
	 * Строит 7 друзей онлайн. Седьмой скрыт.
	 * @return {jQuery} #right
	 */
	builFriendsOnline: function () {
		var frag = $(document.createDocumentFragment());
		if (this.friends.length > 0) {
			this.friends.forEach(function (user_id) {
				var user = new User(user_id);
				frag.append($('<figure>' + user.profileLink(user.ava({marker: false}).icon('cancel', {title: this.loc('Remove', true)}) + ''.link(VK + 'im?sel=' + user.id, {class: 'icon-pencil'}) + '<figcaption>' + user.name + '</figcaption>') + '</figure>').data(user));
			}, this);
		}
		return $('#friends-online').html(frag);
	},

	/**
	 * Строит заявки в друзья
	 * @return {jQuery} #newfriends
	 */
	buildNewFriends: function () {
		var $newfriends = $('#newfriends'),
			frag = $(document.createDocumentFragment());

		if (this.newfriends.length > 0) {

			this.newfriends.forEach(function (user_id) {
				var user = new User(user_id),
					cancelButton = ''.icon('cancel', {class: 'hovered', title: this.loc('Reject')}),
					addButton    = ''.icon('ok', {class: 'hovered', title: this.loc('Accept')});
					
				frag.append($('<figure user-id="' + user.id + '">' + cancelButton + addButton + user.ava({'isLink': true, 'size': 50}) + '<figcaption>' + user.profileLink() + '<span>' + user.status + '</span></figcaption></figure>').data(user));
			}, this);
		} else {
			$('#friends .slide').add($newfriends).removeClass('open'); // Закрыть панель новых друзей
		}
		
		return $newfriends.html(frag);
	},

	/**
	 * Строит диалоги. Если есть не активные диалоги - открывает панель диалогов. 
	 * @return {jQuery} #newmess
	 */
	buildDialogs: function () {
		var $newmess = $('#newmess');

		if (this.dialogs.length > 0) {
			var frag = $(document.createDocumentFragment()),
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
				$('#messages .slide').trigger('click');
			}
		}

		return $newmess;
	},

	/**
	 * Строит Всплывающее сообщение
	 * @return {Boolean} Загружено ли сообщение об ошибке. TRUE - Просто сообщение. FALSE - Была ошибка.
	 */
	buildAlert: function () {
		$('body').removeClass('grayscale');
		if (!this.alerts === undefined || (!this.alerts.error && !this.alerts.message)) {
			return true;
		}
		if (this.alerts.error) {
			var type = 'error';
		} else {
			var type = 'message';
		}

		if (this.alerts[type].body.text === 'connect_error') {
			$('body').addClass('grayscale');
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
				header = '<thead><tr><td>' + this.loc(this.alerts[type].header) + '</td></tr></thead>';
			}
			// Футер
			if (this.alerts[type].footer) {
				footer = '<tfoot><tr><td><a href="#">' + this.loc(this.alerts[type].footer) + '</a></td></tr></tfoot>';
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
					text = this.loc(this.alerts[type].body.text);
					if (text) {
						text += '<br><br>';
					} else {
						text = '';
					}
				}

				if (this.alerts[type].body.ancor) {
					link = this.loc(this.alerts[type].body.ancor);
					if (link) {
						link = link.link(this.alerts[type].body.url).bold();
					} else {
						link = '';
					}
				}
				text = '<tbody><tr><td>' + image + text + link + '</td></tr></tbody>';
			}
			var $alert = $('#alert');	
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
	 * @param  {String}  text		 Строка для перевода.
	 * @param  {Boolean} isRequared  Возвращать строку или undefined
	 * @return {String|undefined}	 Строка перевода или undefined.
	 */
	loc: function (text, isRequared) {
		if (isRequared === false) {
			var def = undefined;
		} else {
			var def = text;
		}

		if (!text || !this.i18n) {
			return def;
		}

		if (this.i18n[text] && this.i18n[text][this.lang]) {
			return this.i18n[text][this.lang];
		} else {
			return def;
		}
	},

	/**
	 * Загружает ссылку "Поделится Вконтакте"
	 * @param  {Function} callback		Функция для обработки ссылки
	 * @param  {Object}   shareOptions	Параметры ссылки "Поделится""
	 * @return {Boolean}				TRUE
	 */
	loadShareUrl: function (share_options) {
		return 'https://vk.com/share.php?' + $.param($.extend({
			'url'			: 'http://vk.com/note45421694_12011424',
			'title'			: chrome.i18n.getMessage('extName'),
			'description'	: chrome.i18n.getMessage('extDesc'),
			'image'			: 'https://pp.vk.me/c623729/v623729694/33226/hJOeXwJ9gSI.jpg'
		}, share_options));
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