/* 
 * ----------------------------------------------------------------------------
 * Extension URI: https://vk.com/vknotice 
 * Author: Alex Kozack
 * Author URI: https://vk.com/alex.kozack
 * License: "THE BEER-WARE LICENSE" (Revision 42)
 * 
 * Copyright 2015 Alex Kozack (email: cawa-93@yandex.ru)
 * 
 * <cawa-93@yandex.ru> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Poul-Henning Kamp
 * ----------------------------------------------------------------------------
 */

function Informer (params) {
	var defaults = {
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
		'options': 'friends,photos,videos,messages,groups,notifications'
	}, p;

	/**
	 * Применяем свойства по-умолчанию
	 */
	params = jQuery.extend(true, defaults, params);
	for (p in params) {
		if (params.hasOwnProperty(p)) {
			this[p] = params[p];
		}
	}
	/**
	 * Установка кода языка 
	 * @param  {[int]}	  lang_code	  [код языка]
	 * @return {[string]}			  [буквенный еквивалент языка]
	 */
	this.setLang = function (lang_code) {
		if (lang_code === 0 || lang_code === 97 || lang_code === 100 || lang_code === 777) { // Русский
			this.api.lang = 0;
			this.abbrlang = 'ru';
		} else if (lang_code === 1) { // Украинский
			this.api.lang = 1;
			this.abbrlang = 'uk';
		} else if (lang_code === 2 || lang_code === 114) { // Белоруский
			this.api.lang = 2;
			this.abbrlang = 'be';
		} else if (lang_code === 6) { // Немецкий
			this.api.lang = 6;
			this.abbrlang = 'de';
		} else if (lang_code === 15) { // Польский
			this.api.lang = 15;
			this.abbrlang = 'pl';
		} else { // Английский (По-умолчанию)
			this.api.lang = 3;
			this.abbrlang = 'en';
		}
	};

	/**
	 * Загрузка перевода 
	 * @param  int	  lang_code	  код языка
	 */
	this.loadTranslate = function (lang_code) {
		if (lang_code === undefined) {
            lang_code = this.api.lang;
        }
		this.setLang(lang_code);
		
		jQuery.getJSON('lang/' + this.abbrlang + '.json', function (translate) {
			chrome.storage.local.set({'i18n': translate});
		}).fail(function (jqxhr, textStatus, error) {
		    var err = textStatus + ", " + error;
		    console.error('Load translate failed: ' + err);
		});
	};
    
	/**
	 * Запуск демона 
	 * @param  delay   Интервалы между запросами
	 */
	this.deamonStart = function (delay) {
		if (this.isDeamonStarted()) {
			console.info('Daemon already running');
			return false;
		} else {
			if (!delay) {
                delay = 2000;
            } else if (delay < 1000) {
                delay = delay * 1000;
            }

			console.info('Daemon running');
			this.mainRequest();
			this.interval = setInterval(this.mainRequest.bind(this), delay);
			return true;
		}
	};

    /**
	 * Остановка демона 
	 */
	this.deamonStop = function () {
		if (!this.isDeamonStarted()) {
			console.info('Daemon already stoped');
			return false;
		}
		clearInterval(this.interval);
		this.interval = undefined;
		console.info('Daemon stopped');
		return true;
	};

	this.isDeamonStarted = function () {
		return this.interval !== undefined;
	};


	/**
	 * Загружает информацию для информера
	 */
	this.mainRequest = function () {
		this.callAPI('execute.getdata', {'options': this.options},
			// Успешно
			function (API) {
				chrome.storage.local.set(API);
				chrome.browserAction.setIcon({path: 'img/icon38.png'});
				this.setCounters(API.counter, API.dialogs);
				this.saveAlert(false, 'error');
			},
			// Ошибка
			function (error, API) {
				chrome.browserAction.setIcon({path: 'img/icon38-off.png'});
				console.error('Main Request fail', error);
				if (!this.api.access_token) {
					console.error('access_token is not specified');
					this.setCounters([]);
					chrome.storage.local.remove(['counter', 'friends', 'dialogs', 'newfriends', 'profiles']);
					this.deamonStop();
					window.open(this.getAuthUrl());
				}
			}
		);
	};
	
	/**
	 * Обращение у ВК API 
	 * @param  {[string]}	method [метод API]
	 */
	this.callAPI = function (method, options, done, fail, always) {
		options = jQuery.extend(this.api, options);
		
		if (method === 'execute.getLang') {
			delete options.lang;
		}

		return jQuery.getJSON('https://api.vk.com/method/' + method, options)
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
	};
	
	/**
	 * Вызывает метод статистики 
	 */
	this.addVisitor = function () {
		this.callAPI('stats.trackVisitor');
	};

	/**
	 * Загружает и устанавливает сообщения 
	 */
	this.loadAlerts = function () {
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
	};

	/**
	 * Парсит строку access_token
	 * @param  string	url access_token
	 * @return object     	объект содержащий параметры доступа
	 * {
	 * 	access_token,
	 * 	user_id,
	 * 	expires_in = 0
	 * 	state = chrome.app.getDetails().id || undefined
	 * }
	 */
	this.parseURL = function (url) {
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
	};

	/**
	 * Сохраняет параметры доступа 
	 * Возвращает TRUE в случае успешного сохранения
	 */
	this.saveAccess = function (access_str) {
		var auth = this.parseURL(access_str);
		if (auth.error === undefined && auth.state !== undefined && auth.state === chrome.app.getDetails().id) {
			this.api.access_token = auth.access_token;
			this.api.user_id = auth.user_id;
			this.deamonStart();
			this.callAPI('execute.getLang', {}, function (lang_code) {
				this.loadTranslate(lang_code);
				chrome.storage.local.set({'api': this.api});
			}.bind(this));
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Удаляет параметры доступа 
	 * Возвращает TRUE в случае успешного сохранения
	 */
	this.removeAccess = function () {
		this.api = {
			'access_token': 'not correct access_token', // Вставляем не правильный access_token чтобы избежать автоматической авторизации
			'user_id': '',
			'lang': 0,
			'v': this.api.v
		};
		this.setCounters([]);
		chrome.storage.local.remove(['api']);
		return true;
	};

	/**
	 * Вычисляет и выводит бейдж 
	 * friends,photos,videos,messages,groups,notifications
	 */
	this.setCounters = function (counters, dialogs) {
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
	};
	
	/**
	 * Воспроизводит звук 
	 */
	this.playSound = function () {
		if (this.audio === true) {
			chrome.tabs.query({
				url: "*://vk.com/*"
			}, function (tabs) {
				if (tabs.length === 0) {
					jQuery('#audio')[0].play();
				}
			});
		}
	};

	/**
	 * Сохраняет всплывающее сообщение 
	 * alert_obj {	
	 *		header	: String
	 * 		body 	: {
	 * 			text,
	 * 			url,
	 * 			ancor 
	 * 		}
	 * 		footer 	: String
	 * }
	 */
	this.saveAlert = function (alert_obj, type) {
		if (type !== 'error') {
			this.alerts.message = alert_obj;
		} else {
			this.alerts.error = alert_obj;
		}
		chrome.storage.local.set({'alerts': this.alerts});
	}


	this.generateError = function (API) {
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
						window.inf.deamonStart();
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
	};

	this.getAuthUrl = function () {
		return 'https://oauth.vk.com/authorize?' + jQuery.param({
			'redirect_uri'	: 'oauth.vk.com/blank.html',
			'client_id'		: 4682781,
			'scope'			: 'offline,friends,messages,notifications',
			'response_type'	: 'token',
			'display'		: 'popup',
			'v'				: this.api.v,
			'state'			: chrome.app.getDetails().id
		});
	};
		
	this.getExtUrl = function () {
		if (/opera/i.test(navigator.userAgent) || /opr/i.test(navigator.userAgent) || /Yandex/i.test(navigator.userAgent) || /YaBrowser/i.test(navigator.userAgent)) {
			return 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin';
		} else {
			return 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn';
		}
	};
		
	this.getShareUrl = function (share_options) {
		return 'https://vk.com/share.php?' + jQuery.param(jQuery.extend({
			'url'			: 'http://vk.com/note45421694_12011424',
			'title'			: chrome.i18n.getMessage('extName'),
			'description'	: chrome.i18n.getMessage('extDesc'),
			'image'			: 'https://pp.vk.me/c623120/v623120694/2c4a7/LIelD5vBXdg.jpg'
		}, share_options));
	};
};