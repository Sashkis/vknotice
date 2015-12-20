/* globals $, chrome, navigator, console, App*/
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

	chrome.windows.create({
		url: this.authUrl,
		focused: true,
		type:  'popup',
	}, (authWindow) => {

		// Событие обновления данных авторизации
		const update = (changes) => {
			if ( changes.user_id ) {
				this.user_id = changes.user_id.newValue;
			}

			if ( changes.access_token ) {
				this.access_token = changes.access_token.newValue;
			}
		};

		// Проверка авторизации
		const isAuth = (window_id) => {
			if ( window_id === authWindow.id ) {
				deferred[this.access_token && this.user_id ? 'resolve' : 'reject'](this);

				chrome.storage.onChanged.removeListener(update);
				chrome.windows.onRemoved.removeListener(isAuth);
			}
		};

		chrome.storage.onChanged.addListener(update);
		chrome.windows.onRemoved.addListener(isAuth);
	});

	return deferred.promise();
};

Vk.prototype.load = function () {
	const deferred = $.Deferred();

	// Загрузка данных авторизации
	new App().load(['access_token', 'user_id']).done(stg => {
		if (stg.access_token && stg.user_id) {
			this.user_id = stg.user_id;
			this.access_token = stg.access_token;

			deferred.resolve(this);
		} else {
			this.auth().then(deferred.resolve, () => {
				console.error('0. Can\'t find access_token or user_id');
				deferred.reject(0);
			});
		}
	});

	return deferred.promise();
};

Vk.prototype.api = function (method, params) {
	const deferred = $.Deferred();
	const get = {};

	!$.isEmptyObject(params) && $.extend(get, params);

	get.v = this.v;
	if (this.access_token) get.access_token = this.access_token;

	$.getJSON(`https://api.vk.com/method/${method}`, get).done((API) => {
		if (typeof API.response !== 'undefined')
			deferred.resolve(API.response);
		else {
			console.error(`2/${API.error.error_code}. ${method}. ${API.error.error_msg}`);
			deferred.reject(2, API.error);
		}
	}).fail((jqxhr) => {
		console.error('1. Connect error');
		deferred.reject(1, jqxhr);
	});

	return deferred.promise();
};
