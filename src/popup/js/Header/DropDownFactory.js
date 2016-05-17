angular.module('PopupHeaderApp')
	.factory('dropdownMenu', ['$httpParamSerializer', 'i18n', function ($httpParamSerializer, i18n) {
		console.log("factory dropdownMenu");
		// storage.defer.then(function (stg) {

		// });
		return function () {
			return [{
				id: 'faq',
				url: 'https://vk.com/vknotice?w=page-90041499_50788371',
				ancor: i18n.get('Ask question'),
			},{
				id: 'offer',
				url: 'https://vk.com/topic-90041499_31898043',
				ancor: i18n.get('Leave offer'),
			},{
				id: 'error',
				url: 'https://vk.com/im?sel=-90041499',
				ancor: i18n.get('Report error'),
			},{
				id: 'divider',
			},{
				id: 'share',
				url: 'https://vk.com/share.php?' + $httpParamSerializer({
					'url'			: 'http://vk.com/note45421694_12011424',
					'title'			: chrome.i18n.getMessage('extName'),
					'description'	: chrome.i18n.getMessage('extDesc'),
					'image'			: 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
					'noparse'		: 'true',
				}),
				ancor: i18n.get('Tell your friends'),
			},{
				id: 'review',
				url: /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent) ?
					('https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container') :
					('https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews'),
				ancor: i18n.get('Leave a review'),
			},{
				id: 'divider',
			},{
				id: 'settings',
				url: 'chrome-extension://'+chrome.app.getDetails().id+'/options/index.html',
				ancor: i18n.get('Settings'),
			},{
				id: 'logout',
				url: '#',
				ancor: i18n.get('Logout'),
			}];
		}
	}]);