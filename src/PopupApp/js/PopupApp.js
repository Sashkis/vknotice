angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
    .config(['$provide', 'AnalyticsProvider', function ($provide, AnalyticsProvider) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$log', function ($delegate, $log) {
                return function (exception, cause) {
                    $log.warn(exception, cause);
                    $delegate(exception, cause);
                };
            }]);
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
    .run(['gettextCatalog', 'storage', '$log', 'Analytics',
    function (gettextCatalog, storage, $log, Analytics) {
        gettextCatalog.debug = true;
        storage.ready.then(function (stg) {
            Analytics.set('&uid', stg.user_id);
            var lang = getLang(stg.lang);
            if (lang !== 'ru') {
                $log.info('Current Language set as "' + lang + '"');
                gettextCatalog.setCurrentLanguage(lang);
            }
        });
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
    }]);
//# sourceMappingURL=PopupApp.js.map