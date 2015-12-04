function App () {};

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
	App.prototype.comment = App.prototype.ext + '#feedback-container';
} else {
	App.prototype.ext = 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn';
	App.prototype.comment = App.prototype.ext + '/reviews';
}

App.prototype.addVisitor = function () {
	var deferred = $.Deferred();
	new Vk().load().done(function (vk) {
		vk.api('stats.trackVisitor').then(deferred.resolve, deferred.reject);
	});

	return deferred.promise();
};