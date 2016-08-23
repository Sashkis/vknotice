var Helpers;
(function (Helpers) {
    trackPage.$inject = ['Analytics', 'storage'];
    function trackPage(Analytics, storage) {
        storage.ready.then(function (stg) {
            stg.user_id && Analytics.set('&uid', stg.user_id);
            var path = getPageTrackUrl();
            Analytics.trackPage(path);
        });
    }
    Helpers.trackPage = trackPage;
    getPageTrackUrl.$inject = [];
    function getPageTrackUrl() {
        switch (location.pathname) {
            case "/OptionsApp/index.html": return '/Options/';
            case "/BackgroundApp/background.html": return '/Background/';
        }
    }
    Helpers.getPageTrackUrl = getPageTrackUrl;
    setCurrentLanguage.$inject = ['gettextCatalog', 'storage'];
    function setCurrentLanguage(gettextCatalog, storage) {
        gettextCatalog.debug = true;
        gettextCatalog.baseLanguage = 'ru_RU';
        storage.ready.then(function (stg) {
            var lang = getLang(stg.lang);
            gettextCatalog.setCurrentLanguage(lang);
            console.info("Current Language set as \"" + lang + "\"");
        });
    }
    Helpers.setCurrentLanguage = setCurrentLanguage;
    function getLang(lang_code) {
        switch (lang_code) {
            case 0:
            case 97:
            case 100:
            case 777:
                return 'ru_RU';
            case 1:
                return 'uk_UA';
            case 2:
            case 114:
                return 'be_BY';
            case 6:
                return 'de_DE';
            case 15:
                return 'pl_PL';
            case 54:
            case 66:
                return 'ro_RO';
            case 61:
                return 'nl_NL';
            default:
                return 'en_US';
        }
    }
    setAnaliticSetting.$inject = ['AnalyticsProvider'];
    function setAnaliticSetting(AnalyticsProvider) {
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
            .setRemoveRegExp(/\/-?[0-9]+/)
            .setHybridMobileSupport(true);
    }
    Helpers.setAnaliticSetting = setAnaliticSetting;
    function getReviewUrl() {
        return /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)
            ? 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container'
            : 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews';
    }
    Helpers.getReviewUrl = getReviewUrl;
    function getShareUrl() {
        var injector = angular.injector(['ng', 'gettext']);
        var $httpParamSerializer = injector.get('$httpParamSerializer');
        var gettextCatalog = injector.get('gettextCatalog');
        return 'https://vk.com/share.php?' + $httpParamSerializer({
            'url': 'https://vk.com/note45421694_12011424',
            'title': gettextCatalog.getString('Информер Вконтакте'),
            'description': gettextCatalog.getString('Отображает количество непрочитанных сообщений и позволяет ответить не заходя в ВК!'),
            'image': 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
            'noparse': 'true',
        });
    }
    Helpers.getShareUrl = getShareUrl;
})(Helpers || (Helpers = {}));
//# sourceMappingURL=Helpers.js.map