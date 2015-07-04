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
function Popup(params) {
	var VK = 'https://vk.com/', p;
	/**
	 * Применяем свойства по-умолчанию
	 */
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
	for (p in params) {
		this[p] = params[p];
	}

	var profCash = this.profiles;
	this.profiles = [];
	profCash.forEach(function (user_obj) {
		var user = new User(user_obj);
		this.profiles[user.id] = user;
	}, this);

	/**
	 * Обращение у ВК API 
	 * @param  {[string]}	method [метод API]
	 */
	this.callAPI = function (method, options, done, fail, always) {
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
	};
	

	/**
	 * Инициализирует плагин для скролбара 
	 */
	this.buildCustomScrollbar = function (options) {
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
	};


	/**
	 * Применяет перевод 
	 */
	this.loadTranslate = function () {
		// Кнопка share
		jQuery('#share').attr('title', this.geti18n('attr.share'));
		// Кнопка опций
		jQuery('#open_option').attr('title', this.geti18n('attr.setings'));
		// Ссылка автора
		jQuery('#dev').text(this.geti18n('global.author'));
		// Ссылка для выхода
		jQuery('#logout').attr('title', this.geti18n('attr.logout'));
		// Меню
		jQuery('#left li').each(function (i, el) {
			jQuery(el).find(".i18n").text(this.geti18n(jQuery(el).attr('id'), 'menu'));
		}.bind(this));
		// Опции
		jQuery('#options .checkbox').each(function (i, el) {
			jQuery(el).find(".i18n").text(this.geti18n(jQuery(el).attr('name'), 'options'));
		}.bind(this));
		// Опции
		jQuery('#newmess #mCSB_2_container').attr('no_mess', this.geti18n('attr.no_mess'));
	};


	/**
	 * Активирует слайд-блоки 
	 */
	this.initSlide = function () {
		jQuery('.slide').on('click', function () {
			var target = jQuery(this).attr('data-target');
			jQuery('.slider.open').add('.slide.open').add(this).add(target).toggleClass('open');
			return false;
		});
	};


	/**
	 * Активирует опции 
	 */
	this.initOptions = function () {
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
		var popup = this;
		// Инициализация
		jQuery('.api_opt').each(function (i, el) {
			if (popup.options.indexOf(jQuery(el).attr('name')) >= 0) {
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
			popup.options = new_options;
			chrome.storage.local.set({'options': new_options });
		});
	};


	/**
	 * Вызывает метод статистики 
	 */
	this.addVisitor = function () {
		this.callAPI('stats.trackVisitor');
	};


	/**
	 * Счетчики 
	 */
	this.builCounters = function () {
		jQuery('#left .counter').text(function (index, value) {
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
					jQuery('#'+key+' span.counter').text('+'+this.counter[key]);
				}
			}
		}
	};


	/**
	 * Удаляет предзагрущик 
	 */
	this.show = function () {
		jQuery('.wraper.show').removeClass('show');
		if (this.counter.messages) {
			jQuery('#messages .counter').click();	
			if (jQuery('#newmess .dialog-unread').length === 1) {
				jQuery('#newmess .dialog-unread').click();
			}
		} else if (this.counter.friends) {
			jQuery('#friends .counter').click();
		}
	};


	this.setCurrentProfile = function () {
		this.current = new User(this.api.user_id-0);
		jQuery('#my a.profile').attr('href', VK+this.current.domain);
		jQuery('header').append(this.current.ava({'isLink':true, 'size':50}) + '<h1>'+this.current.profileLink() + '</h1><h2>' + window.Emoji.emojiToHTML(this.current.status) + '</h2>');
	};

	this.builFriendsOnline = function () {
		var frag = jQuery(document.createDocumentFragment());
		if (this.friends.length > 0) {
			this.friends.forEach(function (user_id) {
				var user = new User(user_id);
				frag.append(jQuery('<figure>' + user.profileLink(user.ava({marker: false}).icon('cancel', {title: this.geti18n('attr.delete')}) + ''.link(VK + 'write' + user.id, {class: 'icon-pencil'}) + '<figcaption>' + user.name() + '</figcaption>') + '</figure>').data(user));
			}, this);
		}
		jQuery('#right').html(frag);
	};

	this.buildNewFriends = function () {
		var $newfriends = jQuery('#newfriends'),
			frag = jQuery(document.createDocumentFragment());

		if (this.newfriends.length > 0) {
			var isRequests = this.counter.friends !== undefined;

			this.newfriends.forEach(function (user_id) {
				var user = new User(user_id);

				if (isRequests) {
					var cancelButton = ''.icon('cancel', {class: 'hovered', title: this.geti18n('attr.remove')});
					var addButton    = ''.icon('ok', {class: 'hovered', title: this.geti18n('attr.add')});
				} else {
					var cancelButton = '';
					var addButton    = ''.icon('ok', {class: 'hovered', title: this.geti18n('attr.request')});
				}
				frag.append(jQuery('<figure user-id="' + user.id + '">' + cancelButton + addButton + user.ava({'isLink': true, 'size': 50}) + '<figcaption>' + user.profileLink() + '<span>' + user.status + '</span></figcaption></figure>').data(user));
			}, this);
		} else {
			jQuery('#friends .slide').add($newfriends).removeClass('open'); // Закрыть панель новых друзей
		}
		$newfriends.html(frag);
	};

	this.buildNewMess = function () {
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
			$newmess.append(frag);
		}
	};


	/**
	 * Всплывающее сообщение
	 */
	this.buildAlert = function () {
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
						image = '<a href="' + this.alerts[type].body.imgLink + '" target="_blank" class="imgLink">' + image + '</a>';
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
						link = '<b><a target="_blank" href="' + this.alerts[type].body.url + '">' + link + '</a></b>';
					} else {
						link = '';
					}
				}
				text = '<tbody><tr><td>' + image + text + link + '</td></tr></tbody>';
			}
			var $alert = jQuery('#alert'),
				isSuccess = type !== 'error';
			if (!isSuccess) {
				$alert.addClass('error');
			}
			$alert.find('table').html(header + text + footer);
			$alert.addClass('show');

			$alert.on('click', 'a', function () {
				$alert.removeClass('show');
				this.alerts[type] = false;
				chrome.storage.local.set({'alerts': this.alerts});
			}.bind(this));
			return isSuccess;
		}
	};


	this.geti18n = function (text, obj) {
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
	};


	this.loadShareUrl = function (callback, shareOptions) {
		var port = chrome.runtime.connect({name: 'getShareUrl'});
		port.postMessage(shareOptions);
		port.onMessage.addListener(callback);
		return true;
	};
}