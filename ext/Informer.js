/**
 * @class
 * @type {Object}
 * @property {String} 	abbrlang 		Символьный код языка
 * @property {Boolean} 	audio 			Звуковые оповещения
 * @property {Number} 	badge 			Число для бейджа
 * @property {Number} 	delay 			Интервалы между запросами
 * @property {String} 	iconSufix 		Суфикс для иконки
 * @property {Number} 	lastLoadAlert 	Последнее загруженное сообщение
 * @property {String} 	options 		Опции
 * @property {Boolean} 	showMessage 	Показывать число сообщений а не диалогов
 * @property {Object} 	alerts 			Объект сообщения
 * @property {Object} 	api 			Объект API
 */
Informer = {
	/**
	 * Применяем свойства по-умолчанию
	 * @param {Object} params Данные загруженные из chrome.storage
	 */
	init: function (params) {
		params = jQuery.extend(true, {
			'badge': 0,
			'lastLoadAlert': 0,
			'abbrlang': 'ru',
			'audio': true,
			'showMessage': false,
			'alerts': {
				'message': false,
				'error': false
			},
			'api': {
				'access_token': '',
				'user_id': '',
				'lang': 0,
				'v': '5.34'
			},
			'options': 'friends,photos,videos,messages,groups,notifications',
			'iconSufix': '.i18n'
		}, params);
		for (var p in params) {
			if (params.hasOwnProperty(p)) {
				this[p] = params[p];
			}
		}
	},
	
	/**
	 * Установка кода языка
	 * @param  {Number}	lang_code	Код установленного языка
	 * @return {Number}				Код загруженного языка
	 */
	setLang: function (lang_code) {
		if (lang_code === 0 || lang_code === 97 || lang_code === 100 || lang_code === 777) { // Русский
			this.abbrlang = 'ru';
			return this.api.lang = 0;
		} else if (lang_code === 1) { // Украинский
			this.abbrlang = 'uk';
			return this.api.lang = 1;
		} else if (lang_code === 2 || lang_code === 114) { // Белоруский
			this.abbrlang = 'be';
			return this.api.lang = 2;
		} else if (lang_code === 6) { // Немецкий
			this.abbrlang = 'de';
			return this.api.lang = 6;
		} else if (lang_code === 15) { // Польский
			this.abbrlang = 'pl';
			return this.api.lang = 15;
		} else { // Английский (По-умолчанию)
			this.abbrlang = 'en';
			return this.api.lang = 3;
		}
	},

	/**
	 * Загрузка перевода 
	 * @param  {Number}	  lang_code	  Код языка для загрузки
	 */
	loadTranslate: function (lang_code) {
		if (this.setLang(lang_code || this.api.lang) < 3) {
			this.iconSufix = '';
		} else {
			this.iconSufix = '.i18n';
		};
		
		jQuery.getJSON('lang/' + this.abbrlang + '.json', function (translate) {
			chrome.storage.local.set({'i18n': translate});
		}).fail(function (jqxhr, textStatus, error) {
		    console.error('Load translate failed: ' + textStatus + ", " + error);
		});
	},

	/**
	 * Запуск демона 
	 * @param  	{Number}	delay	Интервалы между запросами
	 * @returns {Boolean} 			Был ли демон запущен
	 */
	deamonStart: function (delay) {
		if (this.delay) {
			console.info('Daemon already running');
			return false;
		} else {
			this.delay = delay;
			this.mainRequest();
			console.info('Daemon running');
			return true;
		}
	},

    /**
	 * Остановка демона 
	 * @returns {Boolean} 	Был ли демон остановлен
	 */
	deamonStop: function () {
		if (!this.delay) {
			console.info('Daemon already stoped');
			return false;
		}
		this.delay = false;
		console.info('Daemon stopped');
		return true;
	},

	/**
	 * Загружает информацию для информера
	 * Выполняет основной запрос
	 */
	mainRequest: function () {
		this.callAPI('execute.getdata', {'options': this.options},
			// Успешно
			function (API) {
				if (!!API.system && API.system.lastAlertId > this.lastLoadAlert) {
					this.loadAlerts();
				}
				delete API.system;
				chrome.storage.local.set(API);
				chrome.browserAction.setIcon({path: 'img/icon38' + this.iconSufix + '.png'});
				this.setCounters(API.counter, API.dialogs);
				this.saveAlert(false, 'error');
			},
			// Ошибка
			function (error, API) {
				chrome.browserAction.setIcon({path: 'img/icon38' + this.iconSufix + '-off.png'});
				console.error('Main Request fail', error);
				if (!this.api.access_token) {
					console.error('access_token is not specified');
					this.setCounters([]);
					chrome.storage.local.remove(['counter', 'friends', 'dialogs', 'newfriends', 'profiles']);
					this.deamonStop();
					window.open(this.getAuthUrl());
				}
			},
			// Всегда
			function () {
				if (this.delay) {
					setTimeout(function () {
						window.Informer.mainRequest();
					}, this.delay);
				}
			}
		);
	},
	
	/**
	 * Обращение у ВК API 
	 * @param  {String}   method  Метод API
	 * @param  {[type]}   options Параметры запроса
	 * @param  {Function} done    Ajax callback
	 * @param  {Function}   fail    Ajax callback
	 * @param  {Function}   always  Ajax callback
	 */
	callAPI: function (method, options, done, fail, always) {
		options = jQuery.extend(this.api, options);
		
		if (method === 'execute.getLang') {
			delete options.lang;
		}

		jQuery.getJSON('https://api.vk.com/method/' + method, options)
			.done(function (API) {
				if (API.response !== undefined) {
					if (done !== undefined) {
						return done.call(this, API.response);
					}
				} else {
					this.generateError(API);
					if (fail !== undefined) {
						fail.call(this, {'status': API.error.error_code, 'msg': API.error.error_msg}, API);
					}
				}
			}.bind(this))
			.fail(function (jqxhr, textStatus, error) {
				this.generateError();
				if (fail !== undefined) {
					fail.call(this, {'status': textStatus, 'msg': error });
				}
			}.bind(this))
			.always(function () {
				if (always !== undefined) {
					always.call(this);
				}
			}.bind(this));
	},
	
	/**
	 * Вызывает метод статистики 
	 */
	addVisitor: function () {
		this.callAPI('stats.trackVisitor');
	},

	/**
	 * Загружает и устанавливает сообщения 
	 */
	loadAlerts: function () {
		this.callAPI('execute.getAlerts', {
			'lang': this.abbrlang,
			'lastAlert': this.lastLoadAlert
		}, function (loaded) {
			if (loaded.length > 0) {
				this.lastLoadAlert = loaded[0].id;
				chrome.storage.local.set({'lastLoadAlert': loaded[0].id});
				this.saveAlert(loaded[0].alert);
			}
		});
	},

	/**
	 * Парсит строку access_token
	 * @param 	{String}	url access_token
	 * @returns {{access_token: String, user_id: Number, expires_in: 0, state: String}}     	объект содержащий параметры доступа
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
	 * @param 	{String}	access_str	Строка содержащая access_token
	 * @return	{Boolean}				TRUE в случае успешного сохранения
	 */
	saveAccess: function (access_str) {
		var auth = this.parseURL(access_str);
		if (auth.error !== undefined || auth.state !== chrome.app.getDetails().id) {
			return false;
		}
		this.api.access_token = auth.access_token;
		this.api.user_id = auth.user_id;
		this.deamonStart();
		this.callAPI('execute.getLang', {}, function (lang_code) {
			this.loadTranslate(lang_code);
			chrome.storage.local.set({'api': this.api});
		}.bind(this));
		return true;
	},

	/**
	 * Удаляет параметры доступа 
	 * @returns {Boolean} TRUE в случае успешного сохранения
	 */
	removeAccess: function () {
		this.api = {
			'access_token': 'not correct access_token', // Вставляем не правильный access_token чтобы избежать автоматической авторизации
			'user_id': '',
			'lang': 0,
			'v': this.api.v
		};
		this.setCounters([]);
		chrome.storage.local.remove(['api']);
		return true;
	},

	/**
	 * Вычисляет и выводит бейдж 
	 * friends,photos,videos,messages,groups,notifications
	 * @param {Object} counters Объект содержащий счетчики
	 * @param {Object} dialogs 	Объект диалоги
	 */
	setCounters: function (counters, dialogs) {
		if (counters.length === undefined) {
			var sum = 0,
				needSound = false, c;
			for (c in counters) {
				if (c === 'messages' && this.showMessage === true && !!dialogs) {
					for (var i = dialogs.length; i--;) {
						if (dialogs[i].unread > 0) {
							sum += dialogs[i].unread-0;
							if (dialogs[i].push_settings === undefined || dialogs[i].push_settings.sound !== 0 ) {
								needSound = true;
							};
						};
					};
				} else {
					sum += counters[c]-0;
					needSound = true;
				};
			};
			if (sum > this.badge && needSound) {
				this.playSound();
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
			this.badge = 0;
			chrome.browserAction.setBadgeText({text: ''});
			return 0;
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
				if (tabs.length > 0) {
					for (var i = tabs.length; i--;) {
						if (!/.*:\/\/vk.com\/(?:login.php.*)?$/i.test(tabs[i].url)) {
							return false;
						}
					};
				}
				jQuery('#audio')[0].play();
				return true;
			});
		}
	},

	/**
	 * Сохраняет всплывающее сообщение 
	 * @param {String} type 					Тип сообщения 
	 * @param {Object} alert_obj 				Объект сообщения 
	 * @param {String} alert_obj.header 		Текст заголовока 
	 * @param {String} alert_obj.footer 		Текст ссылки "закрыть"
	 * @param {Object} alert_obj.body 			Объект тела 
	 * @param {String} alert_obj.body.text 		Текст тела 
	 * @param {String} alert_obj.body.url 		Адрес ссылки 
	 * @param {String} alert_obj.body.ancor 	Текст ссылки 
	 * @param {String} alert_obj.body.img 		Адрес изображения 
	 * @param {String} alert_obj.body.imgLink 	Ссылка изображения 
	 */
	saveAlert: function (alert_obj, type) {
		if (type !== 'error') {
			this.alerts.message = alert_obj;
		} else {
			this.alerts.error = alert_obj;
		}
		chrome.storage.local.set({'alerts': this.alerts});
	},

	/**
	 * Генерирует и сохраняет объект сообщения
	 * @param  {Object} API Закруженный ответ Вконтакте
	 */
	generateError: function (API) {
		if (API) {
			var alert = {
				'header': 'api_error',
				'body': {
					'text': API.error.error_code + '. ' + API.error.error_msg,
					'ancor': 'Войти',
					'url': this.getAuthUrl()
				}
			};
			if (!this.api.access_token || !this.api.user_id) {
				alert.body.text = '';
				alert.header = '';
			} else if ([5, 7, 15, 17, 113].indexOf(API.error.error_code) !== -1) {
				alert.body.text = '';
				alert.header = '';
			} else if ([6, 9].indexOf(API.error.error_code) !== -1) {
				if (this.deamonStop()) {
					setTimeout(function () {
						window.Informer.deamonStart();
					}, 15000);
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
	},

	/**
	 * @return {String} URL для авторизации
	 */
	getAuthUrl: function () {
		return 'https://oauth.vk.com/authorize?' + jQuery.param({
			'redirect_uri'	: 'https://oauth.vk.com/blank.html.',
			'client_id'		: 4682781,
			'scope'			: 'offline,friends,messages,notifications',
			'response_type'	: 'token',
			'display'		: 'popup',
			'v'				: this.api.v,
			'state'			: chrome.app.getDetails().id
		});
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
	
	/**
	 * @param  {Object} share_options Параметры для ссылки
	 * @return {String}               URL ссылки для "поделится"
	 */
	getShareUrl: function (share_options) {
		return 'https://vk.com/share.php?' + jQuery.param(jQuery.extend({
			'url'			: 'http://vk.com/note45421694_12011424',
			'title'			: chrome.i18n.getMessage('extName'),
			'description'	: chrome.i18n.getMessage('extDesc'),
			'image'			: 'https://pp.vk.me/c623120/v623120694/2c4a7/LIelD5vBXdg.jpg'
		}, share_options));
	},
};