/// <reference path="../../all.d.ts"/>
module SectionsApp {

	angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ui.router', 'DeamonApp', 'focus-if', 'monospaced.elastic'])

		.config(['$stateProvider', '$urlRouterProvider', 'AnalyticsProvider',
			function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, AnalyticsProvider: ng.google.analytics.AnalyticsProvider) {
				AnalyticsProvider
				// .readFromRoute(true)
					.trackPrefix('/Popup')
					.setPageEvent('$stateChangeSuccess');

					$urlRouterProvider.otherwise('/');

					$stateProvider
						.state('home', {
							url: '/',
							templateUrl: "/SectionApp/sections/Default/Default.tpl"
						})
						.state('requests', {
							url: '/requests',
							templateUrl: "/SectionApp/sections/NewFriends/NewFriends.tpl"
						})
						.state('dialogs', {
							url: '/dialogs',
							templateUrl: "/SectionApp/sections/NewMess/NewMess.tpl",
						})
						.state('dialogs.chat', {
							url: '/{peer_id}',
							templateUrl: "/SectionApp/sections/NewMess/NewMess.chat.tpl",
						})
						.state('user', {
							url: '/user/{user_id}',
							templateUrl: "/SectionApp/sections/UserPage/UserPage.tpl",
						})

				// $routeProvider
				// 	.when('/', {
				// 		templateUrl: '/SectionApp/sections/Default/Default.tpl',
				// 		name: 'Меню',
				// 	})
				// 	.when('/NewFriends', {
				// 		templateUrl: '/SectionApp/sections/NewFriends/NewFriends.tpl',
				// 	})
				// 	.when('/NewMess', {
				// 		templateUrl: '/SectionApp/sections/NewMess/NewMess.tpl',
				// 	})
				// 	.when('/NewMess/:peer_id', {
				// 		templateUrl: '/SectionApp/sections/NewMess/NewMess.tpl',
				// 	})
				// 	.otherwise({
				// 		redirectTo: '/'
				// 	});
			}
		])


		.directive('userAva', userAvaDirective)
		.directive('userName', userNameDirective)
		.directive('vkDialog', DialogDirective)
		.directive('vkMessage', MessageDirective)
		.directive('attachment', AttachmentDirective)

		.filter('emoji', ['$sce', ($sce: ng.ISCEService) => (text: string) => $sce.trustAsHtml(new Emoji().emojiToHTML(text))])
		.filter('linkify', () => (text: string) => linkifyStr(text, {
			format: (value, type) => {
				if (type === 'url' && value.length > 40) {
					value = value.slice(0, 25) + '…';
				}
				return value;
			}
		}))

		.service('messMap', MessMapService)

		.controller('UserPageCtrl', UserPageCtrl)
		.controller('SidebarCtrl', SidebarCtrl)
		.controller('ChatCtrl', ChatCtrl)
		.controller('NewMessCtrl', NewMessCtrl)
		.controller('SectionsCtrl', SectionsCtrl)
		;
}
