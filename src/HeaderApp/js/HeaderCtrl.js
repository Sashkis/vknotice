angular.module('HeaderApp')

	.config([
		'$compileProvider',
		function ($compileProvider) {
			// Разрешить ссылки chrome-extension://
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
		},
	])

	.controller('HeaderCtrl', [
		'$log',
		'storage',
		'profile',
		'gettextCatalog',
		'$httpParamSerializer',
		function ($log, storage, profile, gettextCatalog, $httpParamSerializer) {
			const vm = this;

			vm.isDropdownOpen = false;

			vm.getShareUrl = function () {
				return 'https://vk.com/share.php?' + $httpParamSerializer({
					'url'         : 'http://vk.com/note45421694_12011424',
					'title'       : gettextCatalog.getString('Информер Вконтакте'),
					// eslint-disable-next-line max-len
					'description' : gettextCatalog.getString('Отображает количество непрочитанных сообщений и позволяет ответить не заходя в ВК!'),
					'image'       : 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
					'noparse'     : 'true',
				});
			};

			vm.getReviewUrldkfsnd = function () {
				return /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)
				? ('https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container')
				: ('https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews');
			};

			vm.logout = function  ($event) {
				$event.preventDefault();
				$log.warn('Logout');
			};

			storage.ready.then(function (stg) {
				vm.stg = stg;
				profile.init(stg);
				vm.current_user = profile.getById(vm.stg.user_id);
			});

		},
	]);
