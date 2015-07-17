'use strict';
chrome.storage.local.get(['audio', 'showMessage', 'api', 'options', 'alerts', 'lastLoadAlert'], function (storage) {
	Informer.init(storage);
	Informer.deamonStart();
	Informer.callAPI('execute.getLang', {}, function (lang_code) {
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
		chrome.alarms.create('get_review', {'when': Date.now() + 86400000}); // Через 1 день
	}
	 
	// При обновлении
	// else if (details.reason === 'update') {
	// 	chrome.storage.local.remove('newmess');
	// 	chrome.alarms.create('get_review', {'when': Date.now()}); // Через 0 дней
	// 	chrome.alarms.create('say_thanks', {'when': Date.now() + 86400000 * 14 });// Через 7 дней
	// }
});
		
chrome.alarms.onAlarm.addListener(function (alarm) {
	if (alarm.name === 'get_review') {
		Informer.saveAlert({
			'header': 'credo',
			'footer': 'close',
			'body': {
				'img'	 : 'https://vk.com/images/stickers/707/128.png',
				'text'	 : 'review',
				'ancor'	 : 'review_link',
				'imgLink': Informer.getExtUrl(),
				'url'	 : Informer.getExtUrl()
			}
		});
	} else if (alarm.name === 'say_thanks') {
		Informer.saveAlert({
			'header': 'credo',
			'footer': 'close',
			'body': {
				'img'	 : 'https://vk.com/images/stickers/709/128.png',
				'ancor'	 : 'thank',
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
		changes.audio.newValue || true;
	}
	// Изменение настроек аудио из popup
	if (changes.showMessage) {
		Informer.showMessage = changes.showMessage.newValue || false;
	}
});