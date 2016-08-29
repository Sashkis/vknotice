var BgApp;
(function (BgApp) {
    angular.module('BgApp', ['DeamonApp', 'angular-google-analytics', 'gettext'])
        .constant('Config', {
        profilesLimit: 100,
    })
        .run(Helpers.setCurrentLanguage)
        .config(Helpers.setAnaliticSetting)
        .run(Helpers.trackPage)
        .controller('Bg', BgApp.BgClass);
})(BgApp || (BgApp = {}));
//# sourceMappingURL=BackgroundApp.js.map