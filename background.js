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
chrome.storage.local.get(['audio', 'showMessage', 'api', 'options', 'alerts', 'lastLoadAlert'], function (storage) {
	window.inf = new Informer(storage);
	inf.deamonStart(2000);
	inf.callAPI('execute.getLang', {}, function (lang_code) {
		inf.loadTranslate(lang_code);
		inf.addVisitor();
	});

	// Загрузка alerts из ВК
	setInterval(function () {
		if (inf.deamonStatus) {
			inf.loadAlerts();
		}
	}, 10800000); // 3 часа

});

/**
 * Установка сообщений
 */
 // 86400000 - один день
chrome.runtime.onInstalled.addListener(function (details) {
	 
	// При установке
	if (details.reason === 'install') {
		chrome.alarms.create('say_thanks', {'when' : Date.now() + 86400000*7 });// Через 7 дней
		chrome.alarms.create('get_review', {'when' : Date.now() + 86400000*14 }); // Через 10 дней
	}
	 
	// При обновлении
	else if (details.reason === 'update') {
		chrome.alarms.create('get_review', {'when' : Date.now()}); // Через 0 дней
		chrome.alarms.create('say_thanks', {'when' : Date.now() + 86400000*14 });// Через 7 дней
	}
});
		
chrome.alarms.onAlarm.addListener(function (alarm) {
	if (alarm.name === 'get_review') {
		inf.saveAlert({
			'header': 'credo',
			'footer': 'close',
			'body': {
				'img'	 : 'https://vk.com/images/stickers/707/128.png',
				'text'	 : 'review',
				'ancor'	 : 'review_link',
				'imgLink': inf.getExtUrl(),
				'url'	 : inf.getExtUrl()
			}
		});
	} else if (alarm.name === 'say_thanks') {
		inf.saveAlert({
			'header': 'credo',
			'footer': 'close',
			'body': {
				'img'	 : 'https://vk.com/images/stickers/709/128.png',
				'ancor'	 : 'thank',
				'url'	 : inf.getShareUrl(),
				'imgLink': inf.getShareUrl()
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
			port.postMessage(inf.saveAccess(access));
		});
	} else if ('getShareUrl' === port.name) {
		port.onMessage.addListener(function (shareOptions) {
			port.postMessage(inf.getShareUrl(shareOptions));
		});
	} else if ('remove_token' == port.name) {
		port.postMessage(inf.removeAccess());
	}
});


chrome.storage.onChanged.addListener(function(changes){
	// Изменение настроек уведомлений из popup
	if (changes.options) {
		inf.options = changes.options.newValue;
	}
	// Удаляем просмотренные alert'ти
	if (changes.alerts) {
		if (!changes.alerts.newValue) changes.alerts.newValue = {
			'message': false,
			'error': false
		};
		inf.alerts = changes.alerts.newValue;
	}
	// Изменение настроек аудио из popup
	if (changes.audio) {
		if (!changes.audio.newValue) {
			changes.audio.newValue = true;
		}
		inf.audio = changes.audio.newValue;
	}
	// Изменение настроек аудио из popup
	if (changes.showMessage) {
		if (!changes.showMessage.newValue) {
			changes.showMessage.newValue = false;
		}
		inf.showMessage = changes.showMessage.newValue;
	}
});