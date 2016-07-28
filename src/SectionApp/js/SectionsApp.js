var SectionsApp;
(function (SectionsApp) {
    angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ngRoute', 'DeamonApp'])
        .config(['$routeProvider', 'AnalyticsProvider',
        function ($routeProvider, AnalyticsProvider) {
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
        .controller('NewMessCtrl', SectionsApp.NewMessCtrl)
        .controller('SectionsCtrl', SectionsApp.SectionsCtrl);
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsApp.js.map