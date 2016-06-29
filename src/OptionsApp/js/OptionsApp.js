var OptionsApp;
(function (OptionsApp) {
    angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
        .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
        .run(['gettextCatalog', 'storage', 'Analytics', Helpers.setCurrentLanguage]);
})(OptionsApp || (OptionsApp = {}));
//# sourceMappingURL=OptionsApp.js.map