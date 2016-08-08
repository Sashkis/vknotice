var OptionsApp;
(function (OptionsApp) {
    angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
        .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
        .run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
        .run(['Analytics', 'storage', Helpers.trackPage])
        .controller('OptionsCtrl', OptionsApp.OptionsCtrl)
        .directive('checkboxOption', function () {
        return {
            template: "<input ng-model=\"param\" type=\"checkbox\"/>\n\t\t\t\t\t\t\t\t\t <span class=\"fa-stack\">\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-square fa-stack-2x\"></i>\n\t\t\t\t\t\t\t\t\t\t<i ng-if=\"param\" class=\"fa fa-check fa-stack-1x fa-inverse\"></i>\n\t\t\t\t\t\t\t\t\t </span>",
            scope: {
                param: '=?'
            }
        };
    });
})(OptionsApp || (OptionsApp = {}));
//# sourceMappingURL=OptionsApp.js.map