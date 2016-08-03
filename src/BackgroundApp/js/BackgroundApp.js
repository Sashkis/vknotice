var BgApp;
(function (BgApp) {
    angular.module('BgApp', ['DeamonApp', 'angular-google-analytics', 'gettext'])
        .constant('Config', {
        profilesLimit: 100,
    })
        .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
        .run(['Analytics', 'storage', Helpers.trackPage])
        .controller('Bg', BgApp.BgClass);
})(BgApp || (BgApp = {}));
//# sourceMappingURL=BackgroundApp.js.map