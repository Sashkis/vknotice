/* globals document, $, chrome, navigator, Vk, App, console, getCase, setTimeout*/
/*jshint esnext: true */
/*jshint -W097*/

"use strict";
/**
 * @class
 * @type {Object}
 * @property {Number}	badge			Число для бейджа
 * @property {Number}	delay			Интервалы между запросами
 * @property {Boolean}	isStatPosted	Был ли сделан запрос к методу статистики
 */
var Informer = (function () {
	return {
		badge: 0,
		firstRequest: $.Deferred(),

		load: function (params) {
			const deferred = $.Deferred();
			chrome.storage.local.get(params, (storage) => {
				deferred.resolve(storage);
			});

			return deferred.promise();
		},

		/**
		 * Вычисляет код языка
		 * @param  {Number}	lang_code	Код языка для проверки
		 * @return {Number}				Код поддерживаемого языка
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
		 * Запуск демона
		 * @returns {Boolean}	Был ли демон запущен
		 */
		deamonStart: function () {
			if (this.delay > 0) {
				console.info('Daemon already launched');
				return false;
			}
			this.delay = 2000;
			console.info('Demon was launched with an interval of 2 seconds');
			this.mainRequest();
			return true;
		},

		/**
		 * Остановка демона
		 * @returns {Boolean}	Был ли демон остановлен
		 */
		deamonStop: function () {
			if (this.delay < 1) {
				console.info('Daemon already stopped');
				return false;
			}
			this.delay = 0;
			chrome.browserAction.setIcon({path: 'img/icon38-off.png'});
			console.info('Demon has been stopped');
			return true;
		},

		/**
		 * Загружает информацию для информера
		 * Выполняет основной запрос
		 */
		mainRequest: function () {
			$.when(this.load({
				'options' : 'friends,photos,videos,messages,groups,notifications',
				'isLoadComment' : 0,
				'lastOpenComment' : 0,
				'lastLoadAlert' : 0,
			}), new Vk().load()).then((params, vk) => {
				vk.api('execute.getdata_beta', {
					'options': params.options,
					'isLoadComment': params.isLoadComment,
					'lastOpenComment': params.lastOpenComment,
					'user_id': vk.user_id,
				}).done((API) => {
					if ( this.delay > 0 ) {
						API.lang = this.getLangCode(API.lang);

						if ( !!API.system && API.system.lastAlertId > params.lastLoadAlert ) {
							vk.api('execute.getAlerts', {
								'lang': API.lang,
								'lastAlert': params.lastLoadAlert
							}).done((loaded) => {
								if ( !$.isEmptyObject(loaded.alert) ) {
									chrome.storage.local.set({'lastLoadAlert': loaded.id});
									this.saveAlert(loaded.alert);
								}
							});
						}

						delete API.system;
						chrome.storage.local.set(API);
						chrome.browserAction.setIcon({path: 'img/icon38.png'});

						this.setCounters(API.counter, API.dialogs).saveAlert(false, 'error');

						this.firstRequest.resolve();
					}
				}).fail((code, details) => {
					this.generateError(code, details);
					this.badge = 0;

					chrome.browserAction.setIcon({path: 'img/icon38-off.png'});
					chrome.browserAction.setBadgeText({text: ''});
				}).always(() => {
					if ( this.delay > 0 ) {
						setTimeout(() => this.mainRequest(), this.delay);
					}
				});
			}, (code) => {
				this.generateError(code).deamonStop();
				chrome.browserAction.setIcon({path: 'img/icon38-off.png'});
			});
		},

		/**
		 * Вычисляет и выводит бейдж
		 * @param {Object} counters Объект содержащий счетчики
		 * @param {Object} dialogs	Объект диалоги
		 */
		setCounters: function (counters, dialogs) {
			/**
			 * Иногда ВК возвращает пустой масии в качестве счетчиков. Это Баг.
			 * Поле comments присутствует всегда, при условии, что ВК корректно вернул счетчики
			 * Проверяем, существует ли данное поле. Если нет - значит счетчики не корректные и ничего не делаем.
			 */
			if ( counters.comments === undefined ) {
				return this;
			}

			if ( !$.isEmptyObject(counters) ) {

				this.load({'showMessage': true}).done((stg) => {
					let sum = 0;
					let needSound = false;
					$.each(counters, (c, val) => {
						if ( c === 'messages' && !!stg.showMessage && !!dialogs ) {
							sum = dialogs.reduce((sum, dialog) => {
								if ( !!dialog.unread ) {
									if ( !needSound && (dialog.push_settings !== undefined && dialog.push_settings.sound === 1 ) ) {
										needSound = true;
									}
									return sum + dialog.unread;
								} else {
									return sum;
								}
							}, sum);
						} else {
							sum += val-0;
							needSound = true;
						}
					});

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
				});
			} else {
				chrome.browserAction.setBadgeText({text: ''});
				this.badge = 0;
			}

			return this;
		},

		/**
		 * Воспроизводит звук
		 */
		playSound: function () {
			this.load({'audio': true}).done(function (stg) {
				if ( stg.audio === true ) {
					chrome.tabs.query({
						url: '*://vk.com/*'
					}, function (tabs) {
						if (tabs.every(function (tab) {
							return /vk.com\/(?:login.*)?$/i.test(tab.url);
						})) {
							$('#audio')[0].play();
						}
					});
				}
			});
			return this;
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
		 */
		saveAlert: function (alert_obj, type) {
			if ( !!alert_obj ) {
				if ( !type ) type = 'message';

				chrome.storage.local.set({
					[ `alert_${type}` ]:alert_obj
				});
			} else {
				chrome.storage.local.remove([`alert_${type}`]);
			}
			return this;
		},

		/**
		 * Генерирует и сохраняет объект сообщения
		 * @param  {Integer} code			Код ошибки
		 * @param  {Object} details			Объект ошибки
		 */
		generateError: function (code, details) {
			let alert = {
				'header': 'Unknown error occurred',
				'body': {
					'text'	: 'Please inform the developers.',
					'ancor'	: 'Login',
					'url'	: new Vk().authUrl
				}
			};
			switch (code) {
				case 0 :	// Не удалось загрузить access_token или user_id
					alert = {
						'body': {
							'ancor'	: 'Login',
							'url'	: new Vk().authUrl
						}
					};
				break;
				case 1 :	// Ошибка интернет соединения
					alert = {
						'body': {
							'text': 'Check your Internet connection'
						}
					};
				break;
				case 2 :	// Ошибка API
					alert = {
						'header': 'Access error',
						'body': {
							'text'	: `${code}/${details.error_code}. ${details.error_msg}`,
							'ancor'	: 'Login',
							'url'	: new Vk().authUrl
						}
					};

					if ( $.inArray(details.error_code, [5, 7, 10, 15, 17, 113]) !== -1 ) {
						alert.body.text = '';
						alert.header = '';
					} else if ( $.inArray(details.error_code, [6, 9]) !== -1 ) {
						if ( this.deamonStop() ) {
							setTimeout(() => this.deamonStart(), 10000);
						}
						alert = false;
					}
				break;
			}

			alert.code = code;
			return this.saveAlert(alert, 'error');
		}
	};
})();
