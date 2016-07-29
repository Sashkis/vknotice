var PopupApp;
(function (PopupApp) {
    angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
        .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
        .run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
        .run(['storage',
        function (storage) {
            return storage.onChanged(function (changes) {
                return angular.forEach(changes, function (change, key) {
                    return storage.stg[key] = angular.copy(change.newValue);
                });
            });
        }
    ])
        .controller('ContainerCtrl', PopupApp.ContainerCtrl);
})(PopupApp || (PopupApp = {}));
//# sourceMappingURL=PopupApp.js.map