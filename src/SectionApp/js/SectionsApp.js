var SectionsApp;
(function (SectionsApp) {
    angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ngRoute', 'ngScrollbar'])
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
        .controller('SectionsCtrl', SectionsApp.SectionsCtrl)
        .controller('NewMessCtrl', SectionsApp.NewMessCtrl)
        .directive('vkDialog', SectionsApp.DialogDirective);
    ;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsApp.js.map