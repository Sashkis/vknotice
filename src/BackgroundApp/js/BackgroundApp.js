var BgApp;
(function (BgApp) {
    angular.module('BgApp', ['DeamonApp', 'angular-google-analytics'])
        .constant('Config', {
        profilesLimit: 100,
    })
        .config(['AnalyticsProvider', function (AnalyticsProvider) {
            AnalyticsProvider.setAccount({
                tracker: 'UA-71609511-3',
                trackEvent: true,
                fields: {
                    cookieName: 'vknotice-analitics',
                    cookieDomain: 'none',
                },
                set: {
                    forceSSL: true,
                },
            })
                .setHybridMobileSupport(true);
        }])
        .controller('Bg', BgApp.BgClass);
})(BgApp || (BgApp = {}));
//# sourceMappingURL=BackgroundApp.js.map