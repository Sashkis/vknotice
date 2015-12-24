/* globals $, chrome, navigator, Vk, console*/
/*jshint esnext: true */
/*jshint -W097*/
"use strict";

function App () {}

App.prototype.id = chrome.app.getDetails().id;
App.prototype.share = 'https://vk.com/share.php?' + $.param({
	'url'			: 'http://vk.com/note45421694_12011424',
	'title'			: chrome.i18n.getMessage('extName'),
	'description'	: chrome.i18n.getMessage('extDesc'),
	'image'			: 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
	'noparse'		: 'true',
});

if (/(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)) {
	App.prototype.ext = 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin';
	App.prototype.comment = `${App.prototype.ext}#feedback-container`;
} else {
	App.prototype.ext = 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn';
	App.prototype.comment = `${App.prototype.ext}/reviews`;
}

App.prototype.load = function (params) {
	const deferred = $.Deferred();

	chrome.storage.local.get(params, deferred.resolve);

	return deferred.promise();
}

App.prototype.loadTranslate = function (params) {
	const deferred = $.Deferred();
	if (!window.i18n) {
		$.when($.getJSON('../lang/i18n.json'), this.load('lang')).then((ajax, stg) => {
			window.i18n = {
				str: ajax[0],
				lang: stg.lang,
			};
			deferred.resolve(this);
		}, (ajax, stg) => {
			console.error('3. Load translate failed', ajax, stg);
			deferred.reject(3);
		});
	} else {
		deferred.resolve(this);
	}

	return deferred.promise();
}

App.prototype.loc = function (text, isRequared) {
	if (!text) return '';

	const def = isRequared === false ? undefined : text;
	return i18n && i18n.str[text] && i18n.str[text][i18n.lang] ? i18n.str[text][i18n.lang] : def;
}
