/// <reference path="../../all.d.ts"/>
module SectionsApp {

	angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ngRoute', 'ngSanitize'])

		.config(['$routeProvider', 'AnalyticsProvider',
			function($routeProvider: angular.route.IRouteProvider, AnalyticsProvider: any) {
				AnalyticsProvider
					.readFromRoute(true)
					.trackPrefix('/Popup');

				$routeProvider
					.when('/', {
						templateUrl: '/SectionApp/sections/Default/Default.tpl',
						name: 'Меню',
					})
					.when('/NewFriends', {
						templateUrl: '/SectionApp/sections/NewFriends/NewFriends.tpl',
					})
					.when('/NewMess', {
						templateUrl: '/SectionApp/sections/NewMess/NewMess.tpl',
					})
					.when('/NewMess/:peer_id', {
						templateUrl: '/SectionApp/sections/NewMess/NewMess.tpl',
					})
					.otherwise({
						redirectTo: '/'
					});
			}
		])

		.controller('SectionsCtrl', SectionsCtrl)

		.controller('NewMessCtrl', NewMessCtrl)
		.directive('vkDialog', DialogDirective)
		.filter('emoji', () => (text: string) => new Emoji().emojiToHTML(text))
		// .directive('vkDialog', () => {
		// 	return {
		// 		// controller: 'DialogCtrl',
		// 		templateUrl: '/SectionApp/sections/NewMess/dialog.tpl',
		// 		restrict: 'E',
		// 		// scope: false,
		// 		replace: false,
		// 		link: (scope) => {console.log(scope)}
		// 	}
		// });

		;
}
