'use strict';
chrome.storage.local.get(['audio', 'showMessage', 'api', 'options', 'alerts', 'lastLoadAlert', 'openComment', 'loadComment'], function (storage) {
	Informer.init(storage);
	Informer.deamonStart();
	Informer.callAPI('execute.getLang', {lang: null}, function (lang_code) {
		Informer.loadTranslate(lang_code);
		Informer.addVisitor();
	});
});

/**
 * Установка сообщений
 */
 // 86400000 - один день
chrome.runtime.onInstalled.addListener(function (details) {
	 
	// При установке
	if (details.reason === 'install') {
		chrome.alarms.create('say_thanks', {'when': Date.now() + 86400000 * 7});// Через 7 дней
		chrome.alarms.create('get_review', {'when': Date.now() + 900000}); // Через 15 хвилин
	}

	// При обновлении
	// else if (details.reason === 'update') {
	// 	chrome.storage.local.remove('api');
	// 	location.reload();
	// }
});
		
chrome.alarms.onAlarm.addListener(function (alarm) {
	if (alarm.name === 'get_review') {
		Informer.saveAlert({
			'header': 'Try for you',
			'footer': 'Close',
			'body': {
				'img'	 : 'https://vk.com/images/stickers/707/128.png',
				'text'	 : 'Help us to become better',
				'ancor'	 : 'Leave a review',
				'imgLink': Informer.getExtUrl(),
				'url'	 : Informer.getExtUrl()
			}
		});
	} else if (alarm.name === 'say_thanks') {
		Informer.saveAlert({
			'header': 'Try for you',
			'footer': 'Close',
			'body': {
				'img'	 : 'https://vk.com/images/stickers/709/128.png',
				'ancor'	 : 'To thank the author',
				'url'	 : Informer.getShareUrl(),
				'imgLink': Informer.getShareUrl()
			}
		});
	}
});

/**
 * Сохранение или удаление access_token и отправка Share ссылки
 */
chrome.runtime.onConnect.addListener(function (port) {
	if ('get_token' === port.name) {
		port.onMessage.addListener(function (access) {
			port.postMessage(Informer.saveAccess(access));
		});
	} else if ('getShareUrl' === port.name) {
		port.onMessage.addListener(function (shareOptions) {
			port.postMessage(Informer.getShareUrl(shareOptions));
		});
	} else if ('remove_token' == port.name) {
		port.postMessage(Informer.removeAccess());
	}
});


chrome.storage.onChanged.addListener(function (changes) {
	// Изменение настроек уведомлений из popup
	if (changes.options) {
		Informer.options = changes.options.newValue || '';
	}
	// Удаляем просмотренные alert'ти
	if (changes.alerts) {
		Informer.alerts = changes.alerts.newValue || {'message': false, 'error': false};
	}
	// Изменение настроек аудио из popup
	if (changes.audio) {
		if (changes.audio.newValue === undefined) {
			changes.audio.newValue = false;
		}
		Informer.audio = changes.audio.newValue;
	}
	// Изменение настроек аудио из popup
	if (changes.showMessage) {
		if (changes.showMessage.newValue === undefined) {
			changes.showMessage.newValue = false;
		}
		Informer.showMessage = changes.showMessage.newValue;
	}
	// Изменение настроек аудио из popup
	if (changes.loadComment) {
		if (changes.loadComment.newValue === undefined) {
			changes.loadComment.newValue = 1;
		}
		Informer.loadComment = changes.loadComment.newValue;
	}
	// Изменение настроек аудио из popup
	if (changes.openComment !== undefined) {		
		if (changes.openComment.newValue === undefined) {
			changes.openComment.newValue = 0;
		}
		Informer.openComment = changes.openComment.newValue;
	}
});