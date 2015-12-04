/**
 * Popup
 * @class
 */
var Popup = {
	load: function (params) {
		var deferred = $.Deferred();
		chrome.storage.local.get(params, function (storage) {
			deferred.resolve(storage);
		});

		return deferred.promise();
	},

	/**
	 * Инициализирует плагин для скролбара
	 */
	initScroll: function () {
		$("#newmess, #newfriends, #history").mCustomScrollbar({
			axis: 'y',
			autoHideScrollbar: true,
			alwaysShowScrollbar: 0,
			contentTouchScroll: false,
			theme: "dark-thin",
			scrollbarPosition: 'inside',
			scrollInertia: 150,
			keyboard: {
				enable: false
			},
			mouseWheel: {
				scrollAmount: 61
			},
			callbacks:{
				onScroll: function () {
					$(this).trigger('scrollEnd');
				}
			}
		});

		$('#newmess .mCSB_container').attr('data-before', this.loc("Your private messages will be displayed here."));

		return this;
	},

	/**
	 * Загрузка перевода
	 */
	loadTranslate: function () {
		var deferred = $.Deferred();
		var pop = this;

		$.when( $.getJSON('../lang/i18n.json'), pop.load('lang') ).then(function (ajax, stg) {
			pop.i18n = ajax[0];
			pop.lang = stg.lang;
			deferred.resolve();
		}, function (ajax, stg) {
			console.error('3. Load translate failed', ajax, stg);
			deferred.reject(3);
		});

		return deferred.promise();
	},

	/**
	 * Перевод меню
	 */
	setTranslate: function () {
		var pop = this;
		$('#menu li .i18n, .navbar-brand, .dropdown li a').text(function (index, value) {
			return pop.loc(value, false);
		});

		$('#newmess, #newfriends').attr('data-before', function (index, value) {
			return pop.loc(value, false);
		});

		return this;
	},

	loadProfiles: function () {
		var deferred = $.Deferred();
		var pop = this;

		if ( !pop.profiles ) {
			pop.profiles = {};
		}

		pop.load('profiles').done(function (stg) {
			if ( !$.isArray(stg.profiles) || $.isEmptyObject(stg.profiles) ) {
				deferred.reject();
			} else {
				$.each(stg.profiles, function(i, profile) {
					if ( !pop.profiles[ profile.id ] ) {
						pop.profiles[ profile.id ] = profile;
					}
				});
				deferred.resolve();
			}
		});

		return deferred.promise();
	},

	u: function (user_ids) {
		var deferred = $.Deferred();
		var pop = this;
		var known = {};
		var undef = [];
		if ( !$.isArray(user_ids) ) {
			user_ids = [user_ids];
		}
		$.each(user_ids, function(i, id) {
			if ( !!id && !known[id] ) {
				if ( !!pop.profiles[id] ) {
					known[id] = new User( pop.profiles[id] );
				} else {
					known[id] = new User();
					undef.push(id);
				}
			}
		});
		if ( undef.length > 0 ) {
			console.warn('Undefined users:', undef);

			new Vk().api('users.get', {
				fields: 'status,photo_100,domain,online',
				user_ids: undef,
			}).then(function (users) {
				$.each(users, function(i, user) {
					pop.profiles[ user.id ] = user;
					known[ user.id ] = new User( user );
				});
				deferred.resolve(known);
			}, function () {
				console.error('4. Users not loaded', undef);
				deferred.reject(known);
			});
		} else {
			deferred.resolve(known);
		}
		return deferred.promise();
	},

	/**
	 * Активирует слайд-блоки
	 */
	initSlide: function () {
		$(document).on('click', '.slide', function () {
			var target = $(this).attr('data-target');
			if (target === '#' + $('.slider.open').attr('id')) {
				target = '#friends-online';
			}
			$('.slider.open').add('.slide.open').add(this).add(target).toggleClass('open');
			return false;
		});
		return this;
	},

	/**
	 * Вставляет счетчики в меню
	 */
	buildCounters: function () {
		var pop = this;
		var updateCounters = function () {
			return pop.load(['counter', 'showMessage', 'dialogs']).done(function (stg) {
				$('#menu .counter').text(function () {
					var key = $(this).parents('li').attr('id');
					if ( stg.counter[key] ) {
						if ( key === 'messages' && !!stg.showMessage ) {
							stg.counter.messages = 0;
							$.each(stg.dialogs, function(i, dialog) {
								if ( !!dialog.unread ) {
									stg.counter.messages += dialog.unread;
								}
							});
						}
						return '+' + Math.min(stg.counter[key], 99);
					} else {
						return key === 'messages' ? '+' : '';
					}
				});
			});
		};

		chrome.storage.onChanged.addListener(function (changes) {
			if ( !!changes.counter || !!changes.showMessage || !!changes.dialogs ) {
				updateCounters();
			}
		});

		return updateCounters();
	},

	/**
	 * Удаляет предзагрущик
	 * @return {jQuery} .wraper
	 */
	show: function () {
		$('.wraper').remove();
		return this;
	},

	/**
	 * Инициализирует активный профиль. Вставляет информацию о провиле
	 * @return {jQuery} header
	 */
	setCurrentProfile: function () {
		var deferred = $.Deferred();
		var pop = this;

		pop.load('user_id').done(function (stg) {
			pop.u(stg.user_id).always(function (users) {
				pop.current = users[stg.user_id];
				$('#my a.profile').attr('href', 'https://vk.com/' + pop.current.domain);
				$('header .profile').html([
					pop.current.online ? '<i class="mark"></i>' : '',
					pop.current.name,
					pop.current.ava({'isLink':false, 'marker':false, 'size':32})
				]);
				deferred.resolve();
			});
		});

		return deferred.promise();
	},

	/**
	 * Строит 7 друзей онлайн. Седьмой скрыт.
	 * @return {jQuery} #right
	 */
	builFriendsOnline: function () {
		var deferred = $.Deferred();
		var pop = this;

		pop.load('friends').done(function (stg) {
			if ( !$.isEmptyObject( stg.friends ) ) {
				pop.u(stg.friends).always(function (users) {
					var html = [];
					$.each(stg.friends, function(i, id) {
						html.push( $('<a/>', {
							href: 'https://vk.com/im?sel=' + id,
							target: '_blank',
							'class': 'ava-container',
							html: [
								users[id].ava({marker: false}),
								$('<div/>', {
									'class': 'ava-caption',
									html: $('<span/>', {
										'class': 'name',
										html: [
											$('<i/>', {'class': 'icon-pencil'}),
											users[id].name
										]
									})
								})
							]
						}).data('user_id', id) );
					});

					$('#friends-online').html(html).on('click', '.ava-container', function () {
						var id = $(this).data('user_id');
						if ( $('#newmess .dialog').is('#dialog-' + id) ) {
							$('#messages .slide').trigger('click');
							$('#newmess #dialog-' + id).trigger('click');
							return false;
						}
					});

					deferred.resolve();
				});
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise();
	},

	/**
	 * Строит заявки в друзья
	 * @return {jQuery} #newfriends
	 */
	buildNewFriends: function () {
		var deferred = $.Deferred();
		var pop = this;
		pop.load('newfriends').done(function (stg) {
			if ( !$.isEmptyObject( stg.newfriends ) ) {
				var html = [];
				pop.u(stg.newfriends).always(function (users) {
					$.each(stg.newfriends, function(i, id) {
						var s = users[id].status.escapeHtml();
						html.push( $('<figure/>', {
							html: [
								$('<i/>', {
									'class': 'icon-cancel hovered',
									title: pop.loc('Reject')
								}),
								$('<i/>', {
									'class': 'icon-ok hovered',
									title: pop.loc('Accept')
								}),
								users[id].ava({'isLink': true, 'size': 50}),
								$('<figcaption/>', {
									html: [
										users[id].profileLink(),
										$('<span/>', {
											html: s.length > 60 ? s.substr(0, 60) + '…' : s
										})
									]
								}),
							]
						}).data('user_id', id) );
					});

					deferred.resolve();

					$('#newfriends').html( html ).on('click', '.hovered', function () {
						$button = $(this).addClass('icon-spin4 animate-spin');
						new Vk().load().done(function (vk) {
							if ( $button.hasClass('icon-ok') ) {
								var method = 'friends.add';
							} else {
								var method = 'friends.delete';
							}
							$user = $button.parents('figure')
							vk.api(method, $user.data() ).done(function () {
								$user.slideUp('fast');
							}).always(function () {
								$button.removeClass('icon-spin4 animate-spin');
							});
						});
					});
				});
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise();
	},

	/**
	 * Строит диалоги. Если есть не активные диалоги - открывает панель диалогов.
	 * @return {jQuery} #newmess
	 */
	buildDialogs: function () {
		var deferred = $.Deferred();
		var pop = this;

		pop.load(['dialogs', 'options', 'user_id']).done(function (stg) {
			if (stg.dialogs.length > 0) {
				var talkers = [ stg.user_id ];
				$.each(stg.dialogs, function(index, dialog) {
					if ( !!dialog.chat_active ) {
						talkers = talkers.concat(dialog.chat_active);
					} else {
						talkers.push(dialog.user_id);
					}
				});
				pop.u(talkers).always(function (users) {

					// Инициализация
					var $newmess = $('#newmess');
					var html = [];

					// Обработка диалогов
					$.each(stg.dialogs, function(index, dialog) {
						html.unshift( new Dialog( dialog ).construct( users ) );
					});

					deferred.resolve();

					// Откритие поля ответа
					$newmess.html(html).on('click', '.dialog', function (event) {
						var $target = $(this);
						if ( $target.find('a, textarea, .history, .markAsRead').is(event.target) ) {
							return true;
						} else if ( $target.hasClass('open') ) {
							$target.removeClass('open').find('.ans').slideUp('fast');
						} else {

							$newmess.find('.dialog.open').removeClass('open').find('.ans').slideUp('fast');
							$target.addClass('open').find('.ans').slideDown('fast', function () {
								if ( $target.offset().top - 53 > 0 ) {

									$newmess.one('scrollEnd', function() {
										$target.find('textarea').trigger('focus');
									});

									$newmess.mCustomScrollbar('scrollTo', $target);
								} else {
									$target.find('textarea').trigger('focus');
								}
							});
						}
					// Отправка ответа
					}).on('keypress', 'textarea', function (event) {
						if (event.keyCode === 13 && !event.ctrlKey && !event.shiftKey) {
							if ( !!this.value ) {
								var $field = $(this).attr('disabled', 'disabled');

								new Vk().load().done(function (vk) {
									var $dg = $field.parents('.dialog');
									var answer = $dg.data('answer');
									answer.message = $field.val().trim();

									vk.api('messages.send', answer).done(function (mess_id) {

										$field.removeClass('error').val('');

										$dg.removeClass('dialog-unread').addClass('dialog-answer dialog-answer-unread').find('.mess-container').html( new Message({
											id: mess_id,
											user_id: vk.user_id,
											out: 1,
											body: answer.message
										}).getHtml(users, 'compact') );

									}).fail(function () {
										$field.addClass('error');
									}).always(function () {
										$field.removeAttr('disabled').trigger('focus');
									});
								});
							};

							return false;
						}
					});

					// Загрузка истории
					var loadHistory = function () {
						var $button = $(this);
						var isMore = $button.hasClass('more');
						if ( !isMore ) {
							var data = $button.parents('.dialog').data();
							var peer = data.answer;
							var dialogUrl = data.url;
							$('#history .mCSB_container').empty();
						} else {
							var data = $button.data();
							var peer = data.peer;
							var dialogUrl = data.url;
							var start_message_id = data.start_message_id;
						}

						if ( !!start_message_id ) {
							peer.start_message_id = start_message_id;
						}

						new Vk().load().done(function (vk) {
							vk.api('messages.getHistory', peer).done(function (API) {
								var html = [];
								var talkers = [ vk.user_id ];

								$.each(API.items, function (index, mess) {
									talkers.push( mess.from_id );
								});

								pop.u(talkers).always(function (users) {
									$.each(API.items, function (index, mess) {
										html.push( new Message( mess, dialogUrl ).getHtml(users, 'compact').addClass('dialog') );
									});

									start_message_id = API.items[ API.items.length - 1 ].id;
									if ( !isMore ) {
										if ( API.items.length == 20 ) {
											html.push( $('<a/>', {
												'class': 'dialog history more',
												text: pop.loc('More'),
											}).data({
												'url': dialogUrl,
												'peer': peer,
												'start_message_id': start_message_id
											}) );

											$('#history .mCSB_container').html( html );
										}
									} else {
										html.shift();
										$button.before(html).data('start_message_id', start_message_id);
										if ( API.items.length < 20 ) {
											$button.remove();
										}
									}
								});
							});
						});
					};
					$newmess.on('click', '.history', loadHistory);
					$('#history').on('click', '.history', loadHistory);

					chrome.storage.onChanged.addListener(function (changes) {
						if ( !!changes.dialogs && !$.isEmptyObject(changes.dialogs.newValue) ) {
							$.each(changes.dialogs.newValue, function(i, dg) {
								dg = new Dialog(dg);
								$dg = $('#dialog-' + dg.id);
								if ( $dg.length > 0 && $dg.data('hash') != dg.hash() ) {
									var isOpen = $dg.hasClass('open');
									$dg.removeAttr('class').addClass( dg.getClass( isOpen ? 'open' : '' ) ).find('.mess-container').html( dg.constructMessages(users) );
								}
							});
						}
					});

				});
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise();
	},

	checkError: function () {
		var deferred = $.Deferred();
		var pop = this;

		pop.load(['alert_message', 'alert_error']).done(function (stg) {
			if (!!stg.alert_error) {
				pop.buildAlert(stg.alert_error).addClass('error');
				deferred.reject(stg.alert_error.code);
			} else {
				if (!!stg.alert_message)
					pop.buildAlert(stg.alert_message).on('click', 'a[href]', function () {
						chrome.storage.local.remove(['alert_message']);
					});
				deferred.resolve();
			}
		});

		return deferred.promise();
	},


	/**
	 * Строит Всплывающее сообщение
	 * @return {Boolean} Загружено ли сообщение об ошибке. TRUE - Просто сообщение. FALSE - Была ошибка.
	 */
	buildAlert: function (alert) {
		var $alert = $('#alert');
		if ( $alert.hasClass('show') ) return $alert;
		// Инициализация
		var header = $('<thead/>', {
			html: '<tr><td>' + ( !!alert.header ? this.loc(alert.header) : '' ) + '</td></tr>'
		});

		// Футер
		var footer;
		if ( !!alert.footer  ) {
			footer = $('<tfoot/>', {
				html: '<tr><td><a href="#">' + ( !!alert.footer ? this.loc(alert.footer) : '' ) + '</a></td></tr>'
			});
		}

		// Тело
		var body = [];
		if ( !!alert.body  ) {

			// Картинка
			if ( !!alert.body.img  ) {
				body.push( $('<a/>', {
					'class': 'img',
					target: '_blank',
					href: alert.body.url,
					html: $('<img/>', {
						src: alert.body.img
					})
				}) );
			}

			// Текст
			if ( !!alert.body.text  ) {
				body.push( $('<a/>', {
					'class': 'text',
					target: '_blank',
					href: alert.body.url,
					html: this.loc(alert.body.text)
				}) );
			}

			// Ссылка
			if ( !!alert.body.ancor ) {
				body.push( $('<a/>', {
					'class': 'ancor',
					target: '_blank',
					href: alert.body.url,
					html: this.loc(alert.body.ancor)
				}) );

			}
			body = $('<tbody/>',{
				html: $('<tr/>', {
					html: $('<td/>', {
						html: body
					})
				})
			});
		}

		$alert.addClass('show').find('table').html([header, body, footer]);

		return $alert;
	},

	/**
	 * Возвращает строку перевода
	 * @param  {String}  text		 Строка для перевода.
	 * @param  {Boolean} isRequared  Возвращать строку или undefined
	 * @return {String|undefined}	 Строка перевода или undefined.
	 */
	loc: function (text, isRequared) {
		if ( !text ) {
			return '';
		}

		if (isRequared === false) {
			var def = undefined;
		} else {
			var def = text;
		}

		if ( !!this.i18n && !!this.i18n[ text ] && !!this.i18n[ text ][ this.lang ] ) {
			return this.i18n[text][this.lang];
		} else {
			return def;
		}
	},
};