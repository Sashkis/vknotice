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
				'iconSufix': '.i18n'
			}, params);
		} else {
			$.extend(true, this, params);
		}

		// Удаляем не используемые параметры (Нужно для корректного обовления)
		delete this.api.lang;

		// Устанавливаем параметры для ajax
		this.api.v = '5.35';
		this.api.user_id -= 0;

		$.ajaxSetup({
			data: this.api
		});
		chrome.storage.local.set({
			api: this.api
		});
		// Устанавливаем иконку
		this.iconSufix =  this.lang < 3 ? '' : '.i18n'


		this.loadTranslate();
		this.deamonStart();
		if (this.api.access_token) {
			this.addVisitor();
		}
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
	 * @param  	{Number}	delay	Интервалы между запросами
	 * @returns {Boolean} 			Был ли демон запущен
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
	 * @returns {Boolean} 	Был ли демон остановлен
	 */
	deamonStop: function () {
		if (!this.delay) {
			console.info('Daemon already stoped');
			return false;
		}
		this.delay = 0;
		chrome.browserAction.setIcon({path: 'img/icon38' + this.iconSufix + '-off.png'});
		console.info('Daemon stopped');
		return true;
	},

	/**
	 * Загружает информацию для информера
	 * Выполняет основной запрос
	 */
	mainRequest: function () {
		this.callAPI('execute.getdata', {
				'options': this.options,
				'loadComment': this.loadComment,
				'openComment': this.openComment,
			},
			// Успешно
			function (API) {
				if (this.delay) {
					if (!!API.system && API.system.lastAlertId > this.lastLoadAlert) {
						this.loadAlerts();
					}
					delete API.system;
					API.lang = this.getLangCode(API.lang);
					chrome.storage.local.set(API);
					chrome.browserAction.setIcon({path: 'img/icon38' + this.iconSufix + '.png'});
					this.setCounters(API.counter, API.dialogs);
					this.saveAlert(false, 'error');
				}
			},
			// Ошибка
			function (error, API) {
				chrome.browserAction.setIcon({path: 'img/icon38' + this.iconSufix + '-off.png'});
				console.error('Main Request fail', error);
			},
			// Всегда
			function () {
				setTimeout(function () {
					if (window.Informer.delay) {
						window.Informer.mainRequest();
					}
				}, this.delay);
			}
		);
	},
	
	/**
	 * Обращение у ВК API 
	 * @param  {String}   	method  Метод API
	 * @param  {Object}   	options Параметры запроса
	 * @param  {Function} 	done    Ajax callback
	 * @param  {Function}   fail    Ajax callback
	 * @param  {Function}   always  Ajax callback
	 */
	callAPI: function (method, options, done, fail, always) {
		$.getJSON('https://api.vk.com/method/' + method, options)
			.done(function (API) {
				if (API.response !== undefined) {
					if (done !== undefined) {
						return done.call(this, API.response);
					}
				} else {
					if (!this.api.access_token) {
						console.error(method + ': access_token is not specified');
						this.setCounters([]);
						chrome.storage.local.remove(['counter', 'friends', 'dialogs', 'newfriends', 'profiles']);
						this.deamonStop();
						window.open(this.getAuthUrl());
					} else {
						console.error(method + ': Api error', API);
					}
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
		console.log('addVisitor');
		this.callAPI('stats.trackVisitor', {}, function(){
			console.log('add ok');
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
		this.generateError({error: {error_code: 5}});
		this.setCounters([]);
		chrome.storage.local.remove(['counter', 'friends', 'dialogs', 'newfriends', 'profiles', 'api']);
		return true;
	},

	/**
	 * Вычисляет и выводит бейдж 
	 * friends,photos,videos,messages,groups,notifications
	 * @param {Object} counters Объект содержащий счетчики
	 * @param {Object} dialogs 	Объект диалоги
	 */
	setCounters: function (counters, dialogs) {
		if ($.isPlainObject(counters) && !$.isEmptyObject(counters)) {
			var sum = 0,
				needSound = false, c;
			for (c in counters) {
				if (c === 'messages' && this.showMessage === true && !!dialogs) {
					for (var i = dialogs.length; i--;) {
						if (dialogs[i].unread > 0) {
							sum += dialogs[i].unread-0;
							if (dialogs[i].push_settings === undefined || dialogs[i].push_settings.sound !== 0) {
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
				$('#audio')[0].play();
				return true;
			});
		}
	},

	/**
	 * Загружает и устанавливает сообщения 
	 */
	loadAlerts: function () {
		this.callAPI('execute.getAlerts', {
			'lang': this.api.lang,
			'lastAlert': this.lastLoadAlert
		}, function (loaded) {
			if (!$.isEmptyObject(loaded.alert)) {
				this.lastLoadAlert = loaded.id;
				chrome.storage.local.set({'lastLoadAlert': loaded.id});
				this.saveAlert(loaded.alert);
			}
		});
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
		this.alerts[type || 'message'] = alert_obj;
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
	 * @param  {Object} share_options Параметры для ссылки
	 * @return {String}               URL ссылки для "поделится"
	 */
	getShareUrl: function (share_options) {
		return 'https://vk.com/share.php?' + $.param($.extend({
			'url'			: 'http://vk.com/note45421694_12011424',
			'title'			: chrome.i18n.getMessage('extName'),
			'description'	: chrome.i18n.getMessage('extDesc'),
			'image'			: 'https://pp.vk.me/c623729/v623729694/33226/hJOeXwJ9gSI.jpg'
		}, share_options));
	},
};