/// <reference path="../../all.d.ts"/>
module SectionsApp {

	angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ngRoute', 'DeamonApp'])

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
		.filter('emoji', ['$sce', ($sce: ng.ISCEService) => (text: string) => $sce.trustAsHtml(new Emoji().emojiToHTML(text))])
		.filter('linkify', () => (text: string) => linkifyStr(text, {
			format: (value, type) => {
				if (type === 'url' && value.length > 40) {
					value = value.slice(0, 25) + '…';
				}
				return value;
			}
		}))
		;
}
