var SectionsApp;
(function (SectionsApp) {
    angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ui.router', 'DeamonApp', 'focus-if', 'monospaced.elastic'])
        .config(['$stateProvider', '$urlRouterProvider', 'AnalyticsProvider',
        function ($stateProvider, $urlRouterProvider, AnalyticsProvider) {
            AnalyticsProvider
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
            });
        }
    ])
        .directive('userAva', SectionsApp.userAvaDirective)
        .directive('userName', SectionsApp.userNameDirective)
        .directive('vkDialog', SectionsApp.DialogDirective)
        .directive('vkMessage', SectionsApp.MessageDirective)
        .directive('attachment', SectionsApp.AttachmentDirective)
        .directive('request', SectionsApp.RequestDirective)
        .filter('emoji', ['$sce', function ($sce) { return function (text) { return $sce.trustAsHtml(new SectionsApp.Emoji().emojiToHTML(text)); }; }])
        .filter('linkify', function () { return function (text) { return linkifyStr(text, {
        format: function (value, type) {
            if (type === 'url' && value.length > 40) {
                value = value.slice(0, 25) + '…';
            }
            return value;
        }
    }); }; })
        .service('messMap', SectionsApp.MessMapService)
        .controller('UserPageCtrl', SectionsApp.UserPageCtrl)
        .controller('SidebarCtrl', SectionsApp.SidebarCtrl)
        .controller('ChatCtrl', SectionsApp.ChatCtrl)
        .controller('NewMessCtrl', SectionsApp.NewMessCtrl)
        .controller('SectionsCtrl', SectionsApp.SectionsCtrl)
        .controller('TabCtrl', SectionsApp.TabCtrl)
        .controller('NewFriendsCtrl', SectionsApp.NewFriendsCtrl);
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsApp.js.map