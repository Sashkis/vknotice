var OptionsApp;
(function (OptionsApp) {
    angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
        .config(Helpers.setAnaliticSetting)
        .run(Helpers.setCurrentLanguage)
        .run(Helpers.trackPage)
        .controller('OptionsCtrl', OptionsApp.OptionsCtrl)
        .directive('checkboxOption', function () {
        return {
            template: "<input ng-model=\"param\" type=\"checkbox\"/>\n\t\t\t\t\t\t\t<span class=\"fa-stack\">\n\t\t\t\t\t\t\t\t<i class=\"fa fa-square fa-stack-2x\"></i>\n\t\t\t\t\t\t\t\t<i ng-if=\"param\" class=\"fa fa-check fa-stack-1x fa-inverse\"></i>\n\t\t\t\t\t\t\t</span>",
            scope: {
                param: '=?'
            }
        };
    })
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
})(OptionsApp || (OptionsApp = {}));
//# sourceMappingURL=OptionsApp.js.map