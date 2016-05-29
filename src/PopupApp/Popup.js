/* globals document, $, chrome, navigator, Vk, console, getCase, User, Dialog, Message*/
/*jshint esnext: true */
/*jshint -W030, -W097*/
"use strict";
/**
 * Popup
 * @class
 */
var Popup = (function () {
	return {
		/**
		 * Инициализирует плагин для скролбара
		 */
		initScroll: function () {
			$('#newmess, #newfriends, #history').mCustomScrollbar({
				axis: 'y',
				autoHideScrollbar: true,
				alwaysShowScrollbar: 0,
				contentTouchScroll: false,
				theme: 'dark-thin',
				scrollbarPosition: 'inside',
				scrollInertia: 150,
				keyboard: {
					enable: false,
				},
				mouseWheel: {
					scrollAmount: 61
				},
				callbacks:{
					onScroll: function () {
						$(this).trigger('scrollEnd');
					}
				},
			});

			$('#newmess .mCSB_container')
				.attr('data-before', new App().loc('Your private messages will be displayed here.'));

			return this;
		},

		/**
		 * Перевод меню
		 */
		setTranslate: function () {
			const app = new App();
			$('#menu li .i18n, .navbar-brand, .dropdown li a').text((i, value) => app.loc(value, false));
			$('#newmess, #newfriends').attr('data-before', (i, value) => app.loc(value, false));

			return this;
		},

		loadProfiles: function () {
			const deferred = $.Deferred();

			if (!this.profiles) {
				this.profiles = {};
			}

			new App().load('profiles').done(stg => {
				if (!$.isArray(stg.profiles) || $.isEmptyObject(stg.profiles)) {
					deferred.reject();
				} else {
					$.each(stg.profiles, (i, profile) => {
						if (!this.profiles[profile.id]) {
							this.profiles[profile.id] = new User(profile);
						}
					});
					deferred.resolve();
				}
			});

			return deferred.promise();
		},

		u: function (user_ids) {
			const deferred = $.Deferred();
			const known = {};
			const undef = [];

			if (!$.isArray(user_ids)) {
				user_ids = [user_ids];
			}

			$.each(user_ids, (i, id) => {
				if (id && !known[id]) {
					if (this.profiles[id]) {
						known[id] = this.profiles[id];
					} else {
						known[id] = new User();
						undef.push(id);
					}
				}
			});

			if (undef.length > 0) {
				console.warn('Undefined users:', undef);

				new Vk().api('users.get', {
					fields: 'status,photo_100,domain,online',
					user_ids: undef,
				}).then(users => {
					$.each(users, (i, user) => {
						this.profiles[user.id] = new User(user);
						known[user.id] = this.profiles[user.id];
					});

					deferred.resolve(known);
				}, () => {
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
				const target = $(this).attr('data-target');
				$('.slider.open')
					.add(this)
					.add('.slide.open')
					.add(target === `#${$('.slider.open').attr('id')}` ? '#friends-online' : target)
					.toggleClass('open');
				return false;
			});

			const $unread = $('#newmess .dialog-unread');
			if ($unread.length > 0) {
				$('#messages .slide').trigger('click');

				if ($unread.length === 1) {
					$unread.trigger('click');
				}
			}

			return this;
		},

		/**
		 * Вставляет счетчики в меню
		 */
		buildCounters: function () {
			const pop = this;
			const updateCounters = () => {
				const deferred = $.Deferred();

				new App().load(['counter', 'showMessage', 'dialogs']).done(stg => {
					$('#menu .counter').text(function () {
						const key = $(this).parents('li').attr('id');

						if (stg.counter[key]) {
							if (key === 'messages' && stg.showMessage) {
								stg.counter.messages = 0;
								$.each(stg.dialogs, (i, dialog) => {
									if (dialog.unread) {
										stg.counter.messages += dialog.unread;
									}
								});
							}
							return `+${Math.min(stg.counter[key], 999)}`;
						} else {
							return key === 'messages' ? '+' : '';
						}
					});

					if (stg.counter.notifications) {
						$('header > .notifications').attr('data-badge', stg.counter.notifications).removeClass('empty');
					} else {
						$('header > .notifications').removeAttr('data-badge').addClass('empty');
					}
					deferred.resolve();
				});

				return deferred.promise();
			}

			chrome.storage.onChanged.addListener(changes => {
				(changes.counter || changes.dialogs) && updateCounters();
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
			const deferred = $.Deferred();

			new App().load('user_id').done(stg => {
				this.u(stg.user_id).always(users => {
					this.current = users[stg.user_id];
					$('#my a.profile').attr('href', `https://vk.com/${this.current.domain}`);
					$('header .profile').html([
						this.current.first_name,
						$('<img/>', {
							'src': this.current.photo_100,
						}),
						$('<i/>', {
							'class': 'caret',
						})
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
			const deferred = $.Deferred();

			new App().load('friends').done(stg => {
				if (!$.isEmptyObject(stg.friends)) {
					this.u(stg.friends).always(users => {

						stg.friends = stg.friends.map(id => $('<a/>', {
							href: `https://vk.com/im?sel=${id}`,
							target: '_blank',
							'class': 'ava-container',
							html: [
								users[id].ava({ marker: false }),
								$('<div/>', {
									'class': 'ava-caption',
									html: $('<span/>', {
										'class': 'name',
										html: [
											$('<i/>', {'class': 'icon-pencil'}),
											users[id].name,
										]
									})
								})
							]
						}).data('user_id', id));

						$('#friends-online').html(stg.friends).on('click', '.ava-container', function () {
							const id = $(this).data('user_id');
							if ($('#newmess .dialog').is(`#dialog-${id}`)) {
								$('#messages .slide').trigger('click');
								$(`#newmess #dialog-${id}`).trigger('click');
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
			const deferred = $.Deferred();
			const app = new App();

			app.load('newfriends').done(stg => {
				if (!$.isEmptyObject(stg.newfriends)) {
					this.u(stg.newfriends).always(users => {
						stg.newfriends = stg.newfriends.map(id => {
							const s = escapeHtml(users[id].status);
							return $('<figure/>', {
								html: [
									$('<i/>', {
										'class': 'icon-cancel hovered',
										title: app.loc('Reject')
									}),
									$('<i/>', {
										'class': 'icon-ok hovered',
										title: app.loc('Accept')
									}),
									users[id].ava({
										'isLink': true,
										'size': 50
									}),
									$('<figcaption/>', {
										html: [
											users[id].profileLink(),
											$('<span/>', {
												html: s.length > 60 ? `${s.substr(0, 60)}…` : s
											})
										]
									}),
								]
							}).data('user_id', id);
						});

						$('#newfriends').html(stg.newfriends).on('click', '.hovered', function () {
							const $button = $(this).addClass('icon-spin4 animate-spin');
							new Vk().load().done(vk => {
								const $user = $button.parents('figure');

								vk.api(`friends.${$button.hasClass('icon-ok') ? 'add' : 'delete'}`, $user.data())
									.done(() => $user.slideUp('fast'))
									.always(() => $button.removeClass('icon-spin4 animate-spin'));
							});
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
		 * Строит диалоги. Если есть не активные диалоги - открывает панель диалогов.
		 * @return {jQuery} #newmess
		 */
		buildDialogs: function () {
			const deferred = $.Deferred();

			new App().load(['dialogs', 'options', 'user_id']).done(stg => {

				if (stg.dialogs.length > 0) {
					let talkers = [stg.user_id];
					$.each(stg.dialogs, (index, dialog) => {
						if (dialog.chat_active) {
							talkers = talkers.concat(dialog.chat_active);
							talkers.push(dialog.admin_id);
						}
						talkers.push(dialog.user_id);
					});

					this.u(talkers).always(users => {
						const $newmess = $('#newmess');
						window.d = stg.dialogs;
						// Обработка диалогов
						stg.dialogs = stg.dialogs.reverse().map(dialog => new Dialog(dialog).construct(users));

						// Откритие поля ответа
						$newmess.html(stg.dialogs).on('click', '.dialog', function (event) {
							const $target = $(this);

							if ($target.find('a, textarea, .history, .markAsRead').is(event.target)) {
								return true;
							} else if ($target.hasClass('open')) {
								$target.removeClass('open').find('.ans').slideUp('fast');
							} else {
								$newmess.find('.dialog.open').removeClass('open').find('.ans').slideUp('fast');
								$target.addClass('open').find('.ans').slideDown('fast', function () {
									if ($target.offset().top - 53 > 0) {

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
								if (this.value) {
									const $field = $(this).attr('disabled', 'disabled');

									new Vk().load().done(vk => {
										const $dg = $field.parents('.dialog');
										const params = {
											peer_id: $dg.data('peer_id'),
											message: $field.val().trim(),
										};

										vk.api('messages.send', params).done(mess_id => {

											$field.removeClass('error').val('');

											$dg.removeClass('dialog-unread')
												.addClass('dialog-answer dialog-answer-unread')
												.find('.mess-container')
												.html(new Message({
													id: mess_id,
													user_id: vk.user_id,
													out: 1,
													body: params.message,
												}).getHtml(users, 'compact'));

										})
										.fail(() => $field.addClass('error'))
										.always(() => $field.removeAttr('disabled').trigger('focus'));
									});
								}

								return false;
							}
						// Отметить как прочитанное
						}).on('click', '.markAsRead', function () {
							const $button = $(this).addClass('icon-spin4 animate-spin');

							new Vk().load().done(vk => {
								const $dg = $button.parents('.dialog');

								vk.api('messages.markAsRead', {
									peer_id: $dg.data('peer_id'),
								})
								.done(() => $dg.removeClass('dialog-unread'))
								.always(() => $button.removeClass('icon-spin4 animate-spin'));
							});
						// Загрузить историю
						}).on('click', '.history', function () {
							loadHistory($(this));
						});

						deferred.resolve();

						$('#history').on('click', '.history', function () {
							loadHistory($(this));
						});

						// Загрузка истории
						const loadHistory = $button => {
							const isMore = $button.hasClass('more');
							const data = isMore ? $button.data() : $button.parents('.dialog').data() ;

							console.log(data);
							if (!isMore) {
								$('#history .mCSB_container').empty();
							}


							new Vk().load().done(vk => {
								vk.api('messages.getHistory', {
									peer_id: data.peer_id,
									start_message_id: data.start_message_id || 0,
								}).done(API => {
									const talkers = [vk.user_id];

									$.each(API.items, (index, mess) => talkers.push(mess.from_id));

									this.u(talkers).always(users => {
										const mess_count = API.items.length;
										const start_message_id = API.items[mess_count - 1].id;

										API.items = API.items.map(mess => new Message(mess, data.url).getHtml(users, 'compact')[0].addClass('dialog'));

										if (!isMore) {
											if (mess_count === 20) {
												API.items.push($('<a/>', {
													'class': 'dialog history more',
													text: new App().loc('More'),
												}).data({
													'url': data.url,
													'peer_id': data.peer_id,
													'start_message_id': start_message_id,
												}));
											}

											$('#history .mCSB_container').html(API.items);

										} else {
											API.items.shift();
											$button.before(API.items).data('start_message_id', start_message_id);
											if (mess_count < 20) {
												$button.remove();
											}
										}
									});
								});
							});
						}

						chrome.storage.onChanged.addListener(changes => {
							if (changes.dialogs && !$.isEmptyObject(changes.dialogs.newValue)) {
								$.each(changes.dialogs.newValue,(i, dg) => {
									dg = new Dialog(dg);
									const $dg = $(`#dialog-${dg.id}`);
									if ($dg.length > 0 && $dg.data('hash') != dg.hash()) {
										const isOpen = $dg.hasClass('open');
										$dg.removeAttr('class').addClass(dg.getClass(isOpen ? 'open' : '')).find('.mess-container').html(dg.constructMessages(users));
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
			const deferred = $.Deferred();

			new App().load(['alert_message', 'alert_error']).done(stg => {
				if (stg.alert_error) {
					this.buildAlert(stg.alert_error).addClass('error');
					deferred.reject(stg.alert_error.code);
				} else {
					if (stg.alert_message)
						this.buildAlert(stg.alert_message).on('click', 'a[href]', function () {
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
			const $alert = $('#alert');
			if ($alert.hasClass('show')) return $alert;
			const app = new App();
			// Инициализация
			const header = $('<thead/>', {
				html: `<tr><td>${alert.header ? app.loc(alert.header) : ''}</td></tr>`
			});

			// Футер
			const footer = $('<tfoot/>', {
					html: `<tr><td><a href="#">${alert.footer ? app.loc(alert.footer) : ''}</a></td></tr>`
				});

			// Тело
			let body = [];
			if (alert.body) {

				// Картинка
				if (alert.body.img) {
					body.push($('<a/>', {
						'class': 'img',
						target: '_blank',
						href: alert.body.url,
						html: $('<img/>', {
							src: alert.body.img,
						})
					}));
				}

				// Текст
				if (alert.body.text) {
					body.push($('<a/>', {
						'class': 'text',
						target: '_blank',
						href: alert.body.url,
						html: app.loc(alert.body.text),
					}));
				}

				// Ссылка
				if (alert.body.ancor) {
					body.push($('<a/>', {
						'class': 'ancor',
						target: '_blank',
						href: alert.body.url,
						html: app.loc(alert.body.ancor),
					}));

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
	};
})();