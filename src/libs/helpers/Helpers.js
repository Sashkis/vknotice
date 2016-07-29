var Helpers;
(function (Helpers) {
    function trackPage() {
        var dependency = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dependency[_i - 0] = arguments[_i];
        }
        var Analytics = dependency[0], storage = dependency[1];
        storage.ready.then(function (stg) {
            stg.user_id && Analytics.set('&uid', stg.user_id);
            var path = getPageTrackUrl();
            Analytics.trackPage(path);
        });
    }
    Helpers.trackPage = trackPage;
    function getPageTrackUrl() {
        switch (location.pathname) {
            case "/OptionsApp/index.html": return '/Options/';
            case "/BackgroundApp/background.html": return '/Background/';
        }
    }
    Helpers.getPageTrackUrl = getPageTrackUrl;
    function setCurrentLanguage() {
        var dependency = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dependency[_i - 0] = arguments[_i];
        }
        var gettextCatalog = dependency[0], storage = dependency[1];
        gettextCatalog.debug = false;
        storage.ready.then(function (stg) {
            var lang = getLang(stg.lang);
            if (lang !== 'ru') {
                console.info('Current Language set as "' + lang + '"');
                gettextCatalog.setCurrentLanguage(lang);
            }
        });
    }
    Helpers.setCurrentLanguage = setCurrentLanguage;
    function getLang(lang_code) {
        switch (lang_code) {
            case 0:
            case 97:
            case 100:
            case 777:
                return 'ru';
            case 1:
                return 'uk';
            case 2:
            case 114:
                return 'be';
            case 6:
                return 'de';
            case 15:
                return 'pl';
            case 54:
            case 66:
                return 'ro';
            case 61:
                return 'nl';
            default:
                return 'en';
        }
    }
    function setAnaliticSetting() {
        var dependency = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dependency[_i - 0] = arguments[_i];
        }
        var AnalyticsProvider = dependency[0];
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
            .ignoreFirstPageLoad(true)
            .setRemoveRegExp(/[0-9]+/)
            .setHybridMobileSupport(true);
    }
    Helpers.setAnaliticSetting = setAnaliticSetting;
})(Helpers || (Helpers = {}));
//# sourceMappingURL=Helpers.js.map