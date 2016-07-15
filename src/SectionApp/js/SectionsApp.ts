/// <reference path="../../all.d.ts"/>
module SectionsApp {

	angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ngRoute'])
		.constant('SectionsNames', {
			'Default': 'Меню',
			'NewMess': 'Диалоги',
			'NewFriends': 'Заявки в друзья',
		})

		.config(['$routeProvider', 'AnalyticsProvider',
			function($routeProvider: angular.route.IRouteProvider, AnalyticsProvider: any) {
				AnalyticsProvider.readFromRoute(true);
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
					.otherwise({
						redirectTo: '/'
					});
			}
		]);
}
