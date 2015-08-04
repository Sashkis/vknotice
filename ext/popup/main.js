'use strict';
chrome.storage.local.get(['alerts', 'showMessage', 'audio', 'counter', 'friends', 'dialogs', 'newfriends', 'profiles', 'api', 'i18n', 'lang', 'options'], function (storage) {
	Popup.init(storage);
	// buildAlert проверяет ответ ВК на наличие ошибок. Возвращает TRUE если ошибок не найдено
	if (Popup.buildAlert()) {		// Строит уведомления
		Popup.setCurrentProfile();	// Устанавливает Хедер. Инициализируем активный профайл
		Popup.loadTranslate();		// Переводим интерфейс
		Popup.show();				// Уберает предзагрущик

		/**
		 * Генерирует 6 друзей онлайн
		 */
		try {
			var $onlineUsers = Popup.builFriendsOnline();

			// Событине для удаления друга онлайн
			$onlineUsers.on('click', '.icon-cancel', function () {
				var $user = $(this).parents('figure').addClass('delete').append('<div class="wait"><i class="icon-spin4 animate-spin"></i></div>');
				var user = $user.data();

				user.addOrDel('delete', function () {
					$user.remove();
					console.info('User deleted');
				});
				return false;
			});

			// Событине для создания нового сообщения
			$onlineUsers.on('click', '.icon-pencil', function () {
				var user = $(this).parents('figure').data();
				if ($('#newmess .dialog').is('#dialog-' + user.id)) {
					$('#messages .slide').trigger('click');
					$('#newmess #dialog-' + user.id).trigger('click');
					return false;
				}
			});
		} catch (error) {
			console.error(error);
			$('#friends-online').html('<div class="error"><b>builFriendsOnline</b></br>' + error.stack.replace('chrome-extension://' + chrome.app.getDetails().id + '/popup/', '') + '</br></br><b>' + Popup.loc('Please inform the developers.') + '</b></div>');
		}


		Popup.buildCounters();	// Выстраивает счетчики в меню
		Popup.initSlide();		// Активирует события для слайдов

		/**
		 * Генерирует новые сообщения
		 */
		try {
			var $newmess = Popup.buildDialogs();

			// Помечаем сообщения как прочитанные
			$newmess.on('click', '.markAsRead', function (event) {
				var $button = $(this),
					dialog = $button.parents('.dialog').data();
				$button.addClass('icon-spin4 animate-spin');
				return !dialog.markAsRead();
			});
			
			// Открытие поля для ответа
			$newmess.on('click', '.dialog', function (event) {
				if (!$newmess.find('.dialog a, .dialog textarea').is($(event.toElement))) {
					var $ans = $(this).find('.ans');
					if (!$(this).hasClass('open')) {
						$newmess.find('.open').removeClass('open').find('.ans').slideUp();

						$(this).addClass('open');
						$ans.slideDown(function () {
							$newmess.mCustomScrollbar("scrollTo", $ans.parent('.dialog'));
							setTimeout(function () {
								$ans.find('textarea').focus();
							}, 300);
						});
					} else {
						$(this).removeClass('open');
						$ans.slideUp();
					}
					return false;
				} else {
					return !$newmess.find('.dialog textarea').is($(event.toElement));
				}
			});

			// Отправить сообщение
			$newmess.on('keypress', 'textarea', function (event) {
				if (event.keyCode === 13 && !event.ctrlKey && !event.shiftKey) {
					if (this.value) {
						$(this).attr('disabled', 'disabled');
						$(this).parents('.dialog').data().sendAnswer(this.value);
					}
					return false;
				}
			});

			// Событие когда сообщение прочитано
			$newmess.on('onMarkAsRead', '.dialog', function (event, dialog) {
				dialog.jQ.removeClass('dialog-unread');
				dialog.jQ.find('.markAsRead').removeClass('icon-spin4 animate-spin');
			});

			// Событие когда ответ отправлен
			$newmess.on('onSendAnswer', '.dialog', function (event, dialog, answer) {
				dialog.jQ.addClass('dialog-ansver-unread').find('.mess-container').html(new Message({
					body: answer,
					user_id: window.Popup.current.id,
				}, dialog).getHtml('compact')).find('.body').linkify({
				format: function (value, type) {
						if (type === 'url' && value.length > 40) {
							value = value.substr(0, 40) + '…';
						}
						return value;
					}
				});
			});
		} catch (error) {
			console.error(error.stack);
			$('#newmess').html('<div class="error"><b>buildDialogs</b></br>' + error.stack.replace('chrome-extension://' + chrome.app.getDetails().id + '/popup/', '') + '</br></br><b>' + Popup.loc('Please inform the developers.') + '</b></div>');
		}


		/**
		 * Генерирует новые заявки в друзья
		 */
		try {
			var $newfriends = Popup.buildNewFriends();
			// Принять или отклонить заявку в друзья
			$newfriends.on('click', 'i', function () {
				var $button = $(this),
					$parent = $button.parent('figure'),
					user    = $parent.data(),
					method  = $button.hasClass('icon-cancel') ? 'delete' : 'add';

				$button.addClass('icon-spin4 animate-spin');
				user.addOrDel(method,
					// Успешно
					function (API) {
						$parent.slideUp(function(){
							$(this).remove();
							if ($newfriends.find('figure').length === 0) {
								$('#friends .slide').trigger('click');
							}
						});
					},
					// Ошибка
					undefined,
					// Всегда
					function () {
						$button.removeClass('icon-spin4 animate-spin');
					}
				);
			});
		} catch (error) {
			console.error(error);
			$('#newfriends').html('<div class="error"><b>buildNewFriends</b></br>' + error.stack.replace('chrome-extension://' + chrome.app.getDetails().id + '/popup/', '') + '</br></br><b>' + Popup.loc('Please inform the developers.') + '</b></div>');
		}

		Popup.buildCustomScrollbar();	// Инициализирует плагн для скрола
		Popup.addVisitor();				// Делает запрос в ВК к методу статистики

		// Ссылка на страницу расширения
		$('.review').attr('href', Popup.getExtUrl(true));

		// Ссылка на страницу настроек
		$('.settings').attr('href', 'chrome-extension://' + chrome.app.getDetails().id + '/options/index.html');

		// Share ссылка
		Popup.loadShareUrl(function (url) {
			$('.logout').attr('href', url);
		});

		// Событие нажатия на кнопку выхода
		$('.logout').on('click', function () {
			$('.wraper').addClass('show');
			var port = chrome.runtime.connect({name: 'remove_token'});
			port.onMessage.addListener(function (isLogout) {
				if (isLogout) {
					location.reload();
				}
				$('.wraper').removeClass('show');
			});
			return false;
		});
	}
});

chrome.storage.onChanged.addListener(function (changes) {
	if (!!changes.counter) {
		Popup.counter = changes.counter.newValue || [];
	}

	if (!!changes.profiles) {
		if (changes.profiles.newValue === undefined) {
			changes.profiles.newValue = [];
		}
		changes.profiles.newValue.forEach(function (user) {
			user = new User(user);
			Popup.profiles[user.id] = user;
		});
	}

	if (!!changes.friends) {
		Popup.friends = changes.friends.newValue || [];
		Popup.builFriendsOnline();
	}

	if (!!changes.newfriends) {
		Popup.newfriends = changes.newfriends.newValue || [];
		Popup.buildNewFriends();
	}

	if (!!changes.dialogs && $.isArray(changes.dialogs.newValue)) {
		for (var i = changes.dialogs.newValue.length; i--;) {
			var dialog = new Dialog(changes.dialogs.newValue[i]);
			if (Popup.dialogs[dialog.id] !== undefined && Popup.dialogs[dialog.id].hash() !== dialog.hash()) {
				Popup.dialogs[dialog.id].update(changes.dialogs.newValue[i]);
			}
		};
	}

	if (!!changes.alerts) {
		Popup.alerts = changes.alerts.newValue || {error :false, message: false};
		Popup.buildAlert();
	}
	
	Popup.buildCounters();
});