var OptionsApp;
(function (OptionsApp) {
    angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
        .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
        .run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
        .run(['Analytics', 'storage', Helpers.trackPage])
        .controller('OptionsCtrl', OptionsApp.OptionsCtrl)
        .directive('option', function () { return new OptionsApp.OptionsDirective; });
})(OptionsApp || (OptionsApp = {}));
//# sourceMappingURL=OptionsApp.js.map