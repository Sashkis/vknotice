var PopupApp;
(function (PopupApp) {
    angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
        .config(Helpers.setAnaliticSetting)
        .run(Helpers.setCurrentLanguage)
        .run(['storage',
        function (storage) {
            return storage.onChanged(function (changes) {
                return angular.forEach(changes, function (change, key) {
                    return storage.stg[key] = angular.copy(change.newValue);
                });
            });
        }
    ])
        .directive('vkHref', PopupApp.vkHrefDirective)
        .directive('alert', PopupApp.alertDirective)
        .controller('ContainerCtrl', PopupApp.ContainerCtrl)
        .filter('kFilter', function () {
        return function (input, decimals) {
            var suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
            if (isNaN(input))
                return null;
            if (input < 1000)
                return input;
            var exp = Math.floor(Math.log(input) / Math.log(1000));
            return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
        };
    });
})(PopupApp || (PopupApp = {}));
//# sourceMappingURL=PopupApp.js.map