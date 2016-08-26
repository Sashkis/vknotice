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
						.state('friends', {
							url: '/friends',
							templateUrl: "/SectionApp/sections/Friends/tabs.tpl",
							abstract: true,
						})
						.state('friends.all', {
							url: '/all',
							templateUrl: "/SectionApp/sections/Friends/all.tpl",
						})
						.state('friends.requests', {
							url: '/requests',
							templateUrl: "/SectionApp/sections/Friends/requests.tpl",
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
			}
		])


		.directive('userAva', userAvaDirective)
		.directive('userName', userNameDirective)
		.directive('vkDialog', DialogDirective)
		.directive('vkMessage', MessageDirective)
		.directive('attachment', AttachmentDirective)
		.directive('request', RequestDirective)

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
		.controller('TabCtrl', TabCtrl)
		.controller('NewFriendsCtrl', NewFriendsCtrl)
		// .controller('AllFriendsCtrl', AllFriendsCtrl)
		;
}
