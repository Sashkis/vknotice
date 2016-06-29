var BgApp;
(function (BgApp) {
    angular.module('BgApp', ['DeamonApp', 'angular-google-analytics'])
        .constant('Config', {
        profilesLimit: 100,
    })
        .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
        .controller('Bg', BgApp.BgClass);
})(BgApp || (BgApp = {}));
//# sourceMappingURL=BackgroundApp.js.map