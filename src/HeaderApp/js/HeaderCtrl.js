angular.module('HeaderApp')

	.config([
		'$compileProvider',
	    function($compileProvider) {
	    	// Разрешить ссылки chrome-extension://
	        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	    }
	])

	.controller('HeaderCtrl', [
			'$scope',
			'storage',
			'profile',
			'gettextCatalog',
			'$httpParamSerializer',
		function ($scope, storage, profile, gettextCatalog, $httpParamSerializer) {
			$scope.isDropdownOpen = false;

			storage.ready.then(function (stg) {
				$scope.stg = stg;
				profile.init(stg);
				$scope.current_user = profile.getById($scope.stg.user_id);

				$scope.getShareUrl = function () {
					return 'https://vk.com/share.php?' + $httpParamSerializer({
						'url'			: 'http://vk.com/note45421694_12011424',
						'title'			: gettextCatalog.getString('Информер Вконтакте'),
						'description'	: gettextCatalog.getString('Отображает количество непрочитанных сообщений и позволяет ответить не заходя в ВК!'),
						'image'			: 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
						'noparse'		: 'true',
					});
				};

				$scope.getReviewUrl = function () {
					return /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent) ?
						('https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container') :
						('https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews');
				};

				$scope.logout = function  ($event) {
					$event.preventDefault();
					console.warn('Logout');
				}
			});

		}
	]);