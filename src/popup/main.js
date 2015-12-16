/* globals jQuery, chrome, navigator, Vk, console, Popup, App*/
/*jshint esnext: true */
/*jshint -W097*/

"use strict";
jQuery(function ($) {

	$.when(Popup.loadTranslate(), Popup.checkError(), Popup.loadProfiles()).done(function () {
		$.when(Popup.setCurrentProfile(), Popup.builFriendsOnline(), Popup.buildCounters(), Popup.buildDialogs(), Popup.buildNewFriends()).done(function () {
			Popup.setTranslate().show().initScroll().initSlide();

			$('.dropdown').on('click', function () {
				$(this).toggleClass('open');
			});

			const app = new App();
			// Ссылка на страницу расширения
			$('.review').attr('href', app.comment);

			// Ссылка на страницу настроек
			$('.settings').attr('href', 'chrome-extension://' + app.id + '/options/index.html');

			// Share ссылка
			$('.share').attr('href', app.share);

			// Событие нажатия на кнопку выхода
			$('.logout').on('click', function () {
				chrome.storage.local.set({
					'user_id': -1,
					'access_token': 'Not access_token'
				});
				Popup.buildAlert({
					'body': {
						'ancor'	: 'Login',
						'url'	: new Vk().authUrl
					}
				}).addClass('error');
			});

			app.addVisitor();
		});

	}).fail(function (code) {
		if ( code === 3 ) {
			Popup.buildAlert({
				code: 3,
				header: 'Error',
				body: {
					text: '3. Load translate failed'
				}
			}).addClass('error');
		}
	}).always(function () {
		const vk = new Vk();

		$('#alert').on('click', `a[href="${vk.authUrl}"]`, function () {
			vk.auth();
			return false;
		}).on('click', 'a[href]', function () {
			$('#alert').removeClass('show');
		});
	});
});
