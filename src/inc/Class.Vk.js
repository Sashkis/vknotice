/* globals $, chrome, navigator, console*/
/*jshint esnext: true */
/*jshint -W030, -W097*/
"use strict";
function Vk () {}

Vk.prototype.v = '5.40';

Vk.prototype.authUrl = 'https://oauth.vk.com/authorize?' + $.param({
	'redirect_uri'	: 'https://oauth.vk.com/blank.html',
	'client_id'		: 4682781,
	'scope'			: 'offline,friends,messages,notifications,wall',
	'response_type'	: 'token',
	'display'		: 'popup',
	'v'				: Vk.prototype.v,
	'state'			: 'vknotice'
});

Vk.prototype.auth = function () {
	const deferred = $.Deferred();
	const t = this;

	chrome.windows.create({
		url: t.authUrl,
		focused: true,
		type:  "popup",
	}, function (authWindow) {
		// Событие обновления данных авторизации
		function update (changes) {
			if ( !!changes.user_id ) {
				t.user_id = changes.user_id.newValue;
			}

			if ( !!changes.access_token ) {
				t.access_token = changes.access_token.newValue;
				chrome.windows.remove(authWindow.id);
			}
		}

		function isAuth (window_id) {
			if ( window_id === authWindow.id ) {
				if ( !!t.access_token && !!t.user_id ) {
					deferred.resolve();
				} else {
					deferred.reject();
				}
				chrome.storage.onChanged.removeListener(update);
				chrome.windows.onRemoved.removeListener(isAuth);
			}
		}

		chrome.storage.onChanged.addListener(update);
		chrome.windows.onRemoved.addListener(isAuth);
	});
	return deferred.promise();
};

Vk.prototype.load = function () {
	const deferred = $.Deferred();
	const vk = this;

	// Загрузка данных авторизации
	chrome.storage.local.get(['access_token', 'user_id'], function (stg) {
		if ( !!stg.access_token && !!stg.user_id ) {
			vk.user_id = stg.user_id;
			vk.access_token = stg.access_token;

			deferred.resolve(vk);
		} else {
			vk.auth().then(function () {
				deferred.resolve(vk);
			}, function () {
				console.error("0. Can't find access_token or user_id");
				deferred.reject(0);
			});
		}
	});

	return deferred.promise();
};

Vk.prototype.api = function(method, params) {
	const deferred = $.Deferred();
	const get = {};

	!$.isEmptyObject(params) && $.extend(get, params);

	get.v = this.v;
	if ( !!this.access_token ) get.access_token = this.access_token;

	$.getJSON('https://api.vk.com/method/' + method, get).done(function (API) {
		if ( !!API.response ) deferred.resolve(API.response);
		else {
			console.error("2/" + API.error.error_code + ". " + method + ". " + API.error.error_msg);
			deferred.reject(2, API.error);
		}
	}).fail(function (jqxhr) {
		console.error("1. Connect error");
		deferred.reject(1, jqxhr);
	});

	return deferred.promise();
};
