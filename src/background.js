/* globals document, jQuery, chrome, navigator, Vk, App, console, getCase, Informer*/
/*jshint esnext: true */
/*jshint -W097*/

"use strict";
jQuery(function ($) {

	Informer.deamonStart();
	Informer.firstRequest.done(() => {
		new Vk().load().done(vk => vk.api('stats.trackVisitor'));
	});

	function commentUpdate (tab) {
		if (tab.status === 'complete' && /vk.com\/feed\?section=comments/.test(tab.url)) {
			chrome.storage.local.set({
				'lastOpenComment': parseInt(new Date().getTime()/1000)
			});
		}
	}

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.status === 'complete') {
			commentUpdate(tab);
		}
	});

	chrome.tabs.onActivated.addListener((activeInfo) => {
		chrome.tabs.get(activeInfo.tabId, commentUpdate);
	});

	chrome.runtime.onInstalled.addListener((details) => {
		// При установке
		if (details.reason === 'install') {
			chrome.alarms.create('say_thanks', { 'when': $.now() + 86400000 * 7 });	// Через 7 дней
			chrome.alarms.create('get_review', { 'when': $.now() + 3600000 });		// Через 1 час
			chrome.storage.local.set({
				'lastOpenComment': parseInt($.now()/1000)
			});
		}

		// Удалить при следующие обновлении !!!
		if (details.reason === 'update') {
			new App().load(['options', 'isLoadComment', 'lastOpenComment', 'showMessage', 'audio', 'alert_error']).done(stg => {
				chrome.storage.local.clear();
				chrome.storage.local.set(stg);
			});
		}
	});

	chrome.alarms.onAlarm.addListener((alarm) => {
		const app = new App();
		if (alarm.name === 'get_review') {
			Informer.saveAlert({
				'header': 'Try for you',
				'footer': 'Close',
				'body': {
					'img'	 : 'https://vk.com/images/stickers/644/128.png',
					'text'	 : 'Help us to become better',
					'ancor'	 : 'Leave a review',
					'url'	 : app.comment
				}
			});
		} else if (alarm.name === 'say_thanks') {
			Informer.saveAlert({
				'header': 'Try for you',
				'footer': 'Close',
				'body': {
					'img'	 : 'https://vk.com/images/stickers/630/128.png',
					'ancor'	 : 'To thank the author',
					'url'	 : app.share,
				}
			});
		}
	});
});
