module HeaderApp {
	angular.module('HeaderApp', ['StorageApp', 'gettext', 'angular-google-analytics'])

	.config([
		'$compileProvider',
		function ($compileProvider: ng.ICompileProvider) {
			// Разрешить ссылки chrome-extension://
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|chrome-extension):/);
		},
	])

	.controller('HeaderCtrl', HeaderCtrl)
	.directive('vkHeader', () => {
		return {
			templateUrl: '/HeaderApp/Header.tpl',
			restrict: 'E',
			scope: false,
			replace: true,
		}
	});
}
