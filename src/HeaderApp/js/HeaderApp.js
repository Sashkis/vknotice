var HeaderApp;
(function (HeaderApp) {
    angular.module('HeaderApp', ['StorageApp', 'angular-google-analytics', 'ui.router'])
        .config([
        '$compileProvider',
        function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|chrome-extension):/);
        },
    ])
        .controller('HeaderCtrl', HeaderApp.HeaderCtrl)
        .directive('vkHeader', function () {
        return {
            templateUrl: '/HeaderApp/Header.tpl',
            restrict: 'E',
            scope: false,
            replace: true,
        };
    });
})(HeaderApp || (HeaderApp = {}));
//# sourceMappingURL=HeaderApp.js.map