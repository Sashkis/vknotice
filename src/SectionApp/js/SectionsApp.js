var SectionsApp;
(function (SectionsApp) {
    angular.module('SectionsApp', ['VkApp', 'StorageApp', 'ngRoute'])
        .constant('SectionsNames', {
        'Default': 'Меню',
        'NewMess': 'Диалоги',
        'NewFriends': 'Заявки в друзья',
    })
        .config(['$routeProvider', 'AnalyticsProvider',
        function ($routeProvider, AnalyticsProvider) {
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
    ])
        .controller('SectionsCtrl', SectionsApp.SectionsCtrl);
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsApp.js.map