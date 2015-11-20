/**
 * @class
 * @type {Object}
 * @property {String}	abbrlang		Символьный код языка
 * @property {Boolean}	audio			Звуковые оповещения
 * @property {Number}	badge			Число для бейджа
 * @property {Number}	delay			Интервалы между запросами
 * @property {Number}	lastLoadAlert	Последнее загруженное сообщение
 * @property {String}	options			Опции
 * @property {Boolean}	showMessage		Показывать число сообщений а не диалогов
 * @property {Object}	alerts			Объект сообщения
 * @property {Object}	api				Объект API
 */
var Informer = {
	/**
	 * Применяем свойства по-умолчанию
	 * @param {Object} params Данные загруженные из chrome.storage
	 */
	init: function (params) {
		if (!this.api) {
			$.extend(true, this, {
				'badge': 0,
				'lastLoadAlert': 0,
				'audio': true,
				'showMessage': false,
				'alerts': {
					'message': false,
					'error': false
				},
				'api': {
					'access_token': '',
					'user_id': null
				},
				'loadComment':1,
				'openComment':0,
				'options': 'friends,photos,videos,messages,groups,notifications',
				'delay': 0,
				'StatPosted': $.Deferred()
			}, params);
		} else {
			$.extend(true, this, params);
			chrome.storage.local.set({
				api: this.api
			});
		}
		// Устанавливаем параметры для ajax
		this.api.v = '5.40';
		this.api.user_id -= 0;

		this.loadTranslate();
		this.deamonStart();
	},

	/**
	 * Установка кода языка
	 * @param  {Number}	lang_code	Код установленного языка
	 * @return {Number}				Код загруженного языка
	 */
	getLangCode: function (lang_code) {
		switch (lang_code) {
			case 0: case 97: case 100: case 777:
				return 0;  // Русский
			case 1:
				return 1;  // Украинский
			case 2: case 114:
				return 2;  // Белоруский
			case 6:
				return 6;  // Немецкий
			case 15:
				return 15; // Польский
			case 54: case 66:
				return 54; // Румунский
			case 61:
				return 61; // Нидерландский
			default:
				return 3;  // Английский
		}
	},

	/**
	 * Загрузка перевода
	 */
	loadTranslate: function () {
		$.getJSON('lang/i18n.json', function (translate) {
			chrome.storage.local.set({'i18n': translate});
		}).fail(function (jqxhr, textStatus, error) {
		    console.error('Load translate failed: ' + textStatus + ', ' + error);
		});
	},

	/**
	 * Запуск демона
	 * @param	{Number}	delay	Интервалы между запросами
	 * @returns {Boolean}			Был ли демон запущен
	 */
	deamonStart: function (delay) {
		if (this.delay) {
			console.info('Daemon already running');
			return false;
		} else {
			this.delay = delay || 2000;
			console.info('Daemon running');
			this.mainRequest();
			return true;
		}
	},

	/**
	 * Остановка демона
	 * @returns {Boolean}	Был ли демон остановлен
	 */
	deamonStop: function () {
		if (!this.delay) {
			console.info('Daemon already stoped');
			return false;
		}
		this.delay = 0;
		chrome.browserAction.setIcon({path: 'img/icon38-off.png'});
		console.info('Daemon stopped');
		return true;
	},

	/**
	 * Загружает информацию для информера
	 * Выполняет основной запрос
	 */
	mainRequest: function () {
		this.callAPI('execute.getdata_beta', {
			data: {
				'options': this.options,
				'loadComment': this.loadComment,
				'openComment': this.openComment,
			},
			beforeSend: function(jqXHR, settings) {
				if (!this.api.access_token) {
					this.setCounters([]);
					chrome.storage.local.remove(['counter', 'friends', 'dialogs', 'newfriends', 'profiles']);
					this.deamonStop();
					window.open(this.getAuthUrl(), 'VkAuth', 'menubar=no,toolbar=no,personalbar=no,directories=no,location=no,resizable=yes,scrollbars=yes,status=no,centerscreen,innerWidth=600');
				}
				return !!this.delay;
			},
			done: function (API) {
				if (this.delay) {
					if (!!API.system && API.system.lastAlertId > this.lastLoadAlert) {
						this.loadAlerts();
					}
					delete API.system;
					API.lang = this.getLangCode(API.lang);
					chrome.storage.local.set(API);
					chrome.browserAction.setIcon({path: 'img/icon38.png'});
					this.setCounters(API.counter, API.dialogs);
					this.saveAlert(false, 'error');
				}

				if (this.StatPosted.state() === 'pending') {
					setTimeout($.proxy(this, 'addVisitor'), 1000);
				}
			},
			fail: function () {
				chrome.browserAction.setIcon({path: 'img/icon38-off.png'});
			},
			always: function (jqxhr) {
				if (jqxhr.statusText !== 'canceled') {
					setTimeout($.proxy(this, 'mainRequest'), this.delay);
				}
			}
		});
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

		options.data = $.extend({}, this.api, options.data);

		$.ajax($.extend(true, {
			url: 'https://api.vk.com/method/' + method,
			context: this,
			dataType: "json"
		}, options))
		// Обработка удачного запроса
		.done(function (API) {
			if (API.response !== undefined) {
				if (options.done) {
					options.done.call(this, API.response);
				}
			} else {
				console.error(method + ' api error: ' + API.error.error_code + '. ' + API.error.error_msg);
				window.Informer.generateError({
					type: 'api',
					code: API.error.error_code,
					msg: API.error.error_msg,
					status: 4
				});
				if (options.fail) {
					options.fail.call(this, API);
				}
			}
		})
		// Обработка ошибки запроса
		.fail([function (jqxhr) {
			if (jqxhr.statusText !== 'canceled') {
				window.Informer.generateError({
					type: 'ajax',
					code: jqxhr.status,
					msg: jqxhr.statusText,
					status: jqxhr.readyState
				});
			}
			console.error(method + ' ajax error; readyState:' + jqxhr.readyState + '; status:' + jqxhr.status + '; statusText:' + jqxhr.statusText);
		}, options.fail])
		// Всегда
		.always(options.always);
	},

	/**
	 * Вызывает метод статистики
	 */
	addVisitor: function () {
		this.callAPI('stats.trackVisitor', {
			done: function (API) {
				if (API === 1) {
					this.StatPosted.resolve();
				} else {
					this.StatPosted.reject();
				}
			},
		});
	},

	/**
	 * Парсит строку access_token
	 * @param	{String}	url access_token
	 * @returns {{access_token: String, user_id: Number, expires_in: 0, state: String}}   	объект содержащий параметры доступа
	 */
	parseURL: function (url) {
		url = url.replace('#', '');
		var ret = {},
			seg = url.split('&'),
			len = seg.length,
			i = 0,
			s;
		for (; i < len; i++) {
			if (!seg[i]) {
				continue;
			}
			s = seg[i].split('=');
			ret[s[0]] = s[1];
		}
		return ret;
	},

	/**
	 * Сохраняет параметры доступа
	 * @param	{String}	access_str	Строка содержащая access_token
	 * @return	{Boolean}				TRUE в случае успешного сохранения
	 */
	saveAccess: function (access_str) {
		var auth = this.parseURL(access_str);
		if (auth.error !== undefined || auth.state !== chrome.app.getDetails().id) {
			return false;
		}
		this.init({api: {
			access_token: auth.access_token,
			user_id: auth.user_id
		}});
		return true;
	},

	/**
	 * Удаляет параметры доступа
	 * @returns {Boolean} TRUE в случае успешного сохранения
	 */
	removeAccess: function () {
		this.deamonStop();
		this.generateError({
			type: 'api',
			code: 5,
			msg: 'User authorization failed: no access_token passed',
			status: 4
		});
		this.setCounters([]);
		chrome.storage.local.remove(['counter', 'friends', 'dialogs', 'newfriends', 'profiles', 'api']);
		return true;
	},

	/**
	 * Вычисляет и выводит бейдж
	 * @param {Object} counters Объект содержащий счетчики
	 * @param {Object} dialogs	Объект диалоги
	 */
	setCounters: function (counters, dialogs) {
		if ($.isPlainObject(counters) && !$.isEmptyObject(counters)) {
			var sum = 0,
				needSound = false, c;
			for (c in counters) {
				if (c === 'messages' && this.showMessage === true && !!dialogs) {
					sum = dialogs.reduce(function (sum, dialog) {
						if (dialog.unread) {
							if (dialog.push_settings === undefined || dialog.push_settings.sound !== 0) {
								needSound = true;
							};
							return sum + dialog.unread;
						} else {
							return sum;
						}
					}, sum);
				} else {
					sum += counters[c]-0;
					needSound = true;
				};
			};
			if (sum > this.badge && needSound) {
				this.playSound();
				this.badge = 5;
			}
			if (sum > 999) {
				chrome.browserAction.setBadgeText({text: '999+'});
			} else if (sum > 0) {
				chrome.browserAction.setBadgeText({text: sum + ''});
			} else {
				sum = 0;
				chrome.browserAction.setBadgeText({text: ''});
			}
			this.badge = sum;
			return sum;
		} else {
			chrome.browserAction.setBadgeText({text: ''});
			return this.badge = 0;
		}
	},

	/**
	 * Воспроизводит звук
	 */
	playSound: function () {
		if (this.audio === true) {
			chrome.tabs.query({
				url: "*://vk.com/*"
			}, function (tabs) {
				if (tabs.every(function (tab) {
					return /vk.com\/(?:login.*)?$/i.test(tab.url);
				})) {
					$('#audio')[0].play();
				};
			});
		}
	},

	/**
	 * Загружает и устанавливает сообщения
	 */
	loadAlerts: function () {
		this.callAPI('execute.getAlerts', {
			data:{
				'lang': this.lang,
				'lastAlert': this.lastLoadAlert
			},
			done: function (loaded) {
				if (!$.isEmptyObject(loaded.alert)) {
					this.lastLoadAlert = loaded.id;
					chrome.storage.local.set({'lastLoadAlert': loaded.id});
					this.saveAlert(loaded.alert);
				}
			}
		});
	},

	/**
	 * Сохраняет всплывающее сообщение
	 * @param {String} type						Тип сообщения
	 * @param {Object} alert_obj				Объект сообщения
	 * @param {String} alert_obj.header			Текст заголовока
	 * @param {String} alert_obj.footer			Текст ссылки "закрыть"
	 * @param {Object} alert_obj.body			Объект тела
	 * @param {String} alert_obj.body.text		Текст тела
	 * @param {String} alert_obj.body.url		Адрес ссылки
	 * @param {String} alert_obj.body.ancor		Текст ссылки
	 * @param {String} alert_obj.body.img		Адрес изображения
	 * @param {String} alert_obj.body.imgLink	Ссылка изображения
	 */
	saveAlert: function (alert_obj, type) {
		this.alerts[type || 'message'] = alert_obj;
		chrome.storage.local.set({'alerts': this.alerts});
	},

	/**
	 * Генерирует и сохраняет объект сообщения
	 * @param  {Object} error			Объект с информацией об ошибке
	 * @param  {Object} error.type		ajax|api
	 * @param  {Object} error.code		jqxhr.status|API.error.error_code
	 * @param  {Object} error.msg		jqxhr.statusText|API.error.error_msg
	 * @param  {Object} error.status	jqxhr.readyState|4 - Статус AJAX запроса
	 */
	generateError: function (error) {
		if (error.type === 'api') {
			var alert = {
				'header': 'Api Error',
				'body': {
					'text'	: error.code + '. ' + error.msg,
					'ancor'	: 'Login',
					'url'	: this.getAuthUrl()
				}
			};
			if (!this.api.access_token || !this.api.user_id) {
				alert.body.text = '';
				alert.header = '';
			} else if ($.inArray(error.code, [5, 7, 15, 17, 113]) !== -1) {
				alert.body.text = '';
				alert.header = '';
			} else if ($.inArray(error.code, [6, 9]) !== -1) {
				if (this.deamonStop()) {
					setTimeout($.proxy(this, 'deamonStart'), 15000);
				}
				alert = false;
			}
		} else {
			var alert = {
				'body': {
					'text': 'connect_error'
				}
			};
		}
		this.saveAlert(alert, 'error');
		return alert;
	},

	/**
	 * @return {String} URL для авторизации
	 */
	getAuthUrl: function () {
		return 'https://oauth.vk.com/authorize?' + $.param({
			'redirect_uri'	: 'https://oauth.vk.com/blank.html',
			'client_id'		: 4682781,
			'scope'			: 'offline,friends,messages,notifications,wall',
			'response_type'	: 'token',
			'display'		: 'popup',
			'v'				: this.api.v,
			'state'			: chrome.app.getDetails().id
		});
	},

	/**
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
	},

	/**
	 * @param  {Object} share_options	Параметры для ссылки
	 * @return {String}					URL ссылки для "поделится"
	 */
	getShareUrl: function (share_options) {
		return 'https://vk.com/share.php?' + $.param($.extend({
			'url'			: 'http://vk.com/note45421694_12011424',
			'title'			: chrome.i18n.getMessage('extName'),
			'description'	: chrome.i18n.getMessage('extDesc'),
			'image'			: 'https://pp.vk.me/c623123/v623123694/557d0/JQp0qYXHYcY.jpg',
			'noparse'		: 'true',
		}, share_options));
	},
};