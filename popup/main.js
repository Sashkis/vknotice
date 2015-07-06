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
'use strict';
setTimeout(function () {
	chrome.storage.local.get(['alerts','showMessage','audio','counter','friends','dialogs','newfriends','profiles','api','i18n','options'], function (storage) {
		window.pop = new Popup(storage);
		// buildAlert проверяет ответ ВК на наличие ошибок. Возвращает TRUE если ошибок не найдено
		if (pop.buildAlert()) {		// Строит уведомления
			pop.setCurrentProfile();	// Устанавливает Хедер. Инициализируем активный профайл

			/**
			 * Генерирует 6 друзей онлайн
			 */
			pop.builFriendsOnline();
			var $onlineUsers = 	jQuery('#right figure');
			// Событине для удаления друга онлайн
			$onlineUsers.on('click', '.icon-cancel', function () {
				var $user = jQuery(this).parents('figure');
				// console.log( $user );
				$user.addClass('delete').append('<div class="wait"><i class="icon-spin4 animate-spin"></i></div>');
				var user = $user.data();

				user.addOrDel('delete',function () {
					$user.remove();
					console.info('User deleted');
				});
				return false;
			});

			// Событине для создания нового сообщения
			$onlineUsers.on('click', '.icon-pencil', function () {
				var user = jQuery(this).parents('figure').data();
				if (jQuery('#newmess .dialog').is('#dialog-' + user.id)) {
					jQuery('#messages .slide').trigger('click');
					jQuery('#newmess #dialog-' + user.id).trigger('click');
					return false;
				}
			});


			pop.builCounters();			// Выстраивает счетчики в меню
			pop.initSlide();			// Активирует события для слайдов

			/**
			 * Генерирует новые сообщения
			 */
			pop.buildNewMess();
			var $newmess = jQuery('#newmess');

			// Помечаем сообщения как прочитанные
			$newmess.on('click', '.markAsRead', function (event) {
				var $button = jQuery(this),
					dialog = $button.parents('.dialog').data();
				$button.addClass('icon-spin4 animate-spin');
				return !dialog.markAsRead();
			});
			
			// Открытие поля для ответа
			$newmess.on('click', '.dialog', function (event) {
				if (!$newmess.find('.dialog a, .dialog textarea').is(jQuery(event.toElement))) {
					var $ans = jQuery(this).find('.ans');
					if (!jQuery(this).hasClass('open')) {
						$newmess.find('.open').removeClass('open').find('.ans').slideUp();

						jQuery(this).addClass('open')
						$ans.slideDown(function () {
							$newmess.mCustomScrollbar("scrollTo", $ans.parent('.dialog'));
							setTimeout(function () {
								$ans.find('textarea').focus();
							}, 300);
						});
					} else {
						jQuery(this).removeClass('open');
						$ans.slideUp();
					}
					return false;
				} else {
					return !$newmess.find('.dialog textarea').is(jQuery(event.toElement));
				}
			});

			// Отправить сообщение
			$newmess.on('submit', 'textarea', function (eventObject) {
				if (eventObject.which === 13 && eventObject.shiftKey === false ) {
					jQuery(this).attr('disabled', 'disabled');

					var dialog = jQuery(this).parents('.dialog').data();
					return !dialog.sendAnswer(jQuery(this).val());
				}
			});
			$newmess.on('keypress', 'textarea', function (eventObject) {
				if (eventObject.which === 13 && eventObject.shiftKey === false ) {
					jQuery(this).attr('disabled', 'disabled');

					var dialog = jQuery(this).parents('.dialog').data();
					return !dialog.sendAnswer(jQuery(this).val());
				}
			});

			// Событие когда сообщение прочитано
			$newmess.on('onMarkAsRead', '.dialog', function (event, dialog) {
				dialog.jQ.removeClass('dialog-unread');
				dialog.jQ.find('.markAsRead').removeClass('icon-spin4 animate-spin');
			});

			// Событие когда ответ отправлен
			$newmess.on('onSendAnswer', '.dialog', function (event, dialog, answer) {
				answer = new Message({
					body: answer,
					user_id: window.pop.current.id,
				}, dialog);
				dialog.jQ.find('.mess-container').html(answer.getHtml('compact'));
			});

			pop.show();	// Уберает предзагрущик

			/**
			 * Генерирует новые заявки в друзья
			 */
			pop.buildNewFriends();
			var $newfriends = jQuery('#newfriends');
			// Принять или отклонить заявку в друзья
			$newfriends.on('click', 'i', function () {
				window.pop.CanUpDate = false;
				var $button = jQuery(this),
					$parent = $button.parent('figure'),
					user    = $parent.data(),
					method  = $button.hasClass('icon-cancel') ? 'delete' : 'add';

				$button.addClass('icon-spin4 animate-spin');
				user.addOrDel(method,
					// Успешно
					function (API) {
						$parent.slideUp();
					},
					// Ошибка
					null,
					// Всегда
					function () {
						window.pop.CanUpDate = true;
						$button.removeClass('icon-spin4 animate-spin');
					}
				);
			});

			pop.buildCustomScrollbar(); // Инициализирует плагн для скрола
			pop.loadTranslate();		// Переводим интерфейс

			pop.addVisitor();			// Делает запрос в ВК к методу статистики
			pop.initOptions();			// Переключает настройки. Активирует событие переключения настроек

			// Share ссылка
			pop.loadShareUrl(function (url) {
				jQuery('#share').attr('href', url);
			});

			// Событие нажатия на кнопку выхода
			jQuery('#logout').on('click', function () {
				pop.CanUpDate = false;
				chrome.runtime.connect({name: 'remove_token'});
				location.reload();
				return false;
			});
		}
	});

	chrome.storage.onChanged.addListener(function (changes) {
		if (changes.counter !== undefined) {
			pop.counter = changes.counter.newValue || [];
		}

		if (changes.profiles !== undefined) {
			if (changes.profiles.newValue === undefined) changes.profiles.newValue = [];
			changes.profiles.newValue.forEach(function (user) {
				user = new User(user);
				pop.profiles[user.id] = user;
			});
		}

		if (changes.friends !== undefined) {
			pop.friends = changes.friends.newValue || [];
			pop.builFriendsOnline();
		}

		if (changes.newfriends !== undefined) {
			pop.newfriends = changes.newfriends.newValue || [];
			pop.buildNewFriends();
		}

		if (changes.dialogs !== undefined && changes.dialogs.newValue !== undefined) {
			for (var i = changes.dialogs.newValue.length; i--;) {
				var dialog = new Dialog(changes.dialogs.newValue[i]);
				if (pop.dialogs[dialog.id] !== undefined && pop.dialogs[dialog.id].hash() !== dialog.hash()) {
					pop.dialogs[dialog.id].update(changes.dialogs.newValue[i]);
				}
			};
		}

		if (changes.alerts !== undefined) {
			pop.alerts = changes.alerts.newValue || {error :false, message: false};
			pop.buildAlert();
		}
		
		pop.builCounters();
	});
},0);