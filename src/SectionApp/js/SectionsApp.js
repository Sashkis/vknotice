var SectionsApp;
(function (SectionsApp) {
    angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ui.router', 'DeamonApp'])
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
                .state('requests', {
                url: '/requests',
                templateUrl: "/SectionApp/sections/NewFriends/NewFriends.tpl"
            })
                .state('dialogs', {
                url: '/dialogs',
                templateUrl: "/SectionApp/sections/NewMess/NewMess.tpl"
            })
                .state('dialogs.chat', {
                url: '/{peer_id:int}',
                templateUrl: "/SectionApp/sections/NewMess/NewMess.chat.tpl",
								pageTrack: '/dialogs'
            });
        }
    ])
        .directive('userAva', SectionsApp.userAvaDirective)
        .directive('userName', SectionsApp.userNameDirective)
        .directive('vkDialog', SectionsApp.DialogDirective)
        .directive('message', SectionsApp.MessageDirective)
        .directive('attachment', SectionsApp.AttachmentDirective)
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
        .controller('ChatCtrl', SectionsApp.ChatCtrl)
        .controller('NewMessCtrl', SectionsApp.NewMessCtrl)
        .controller('SectionsCtrl', SectionsApp.SectionsCtrl);
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsApp.js.map
