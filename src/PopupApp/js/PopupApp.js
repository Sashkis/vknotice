angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])

.config(['AnalyticsProvider', function (AnalyticsProvider) {
	AnalyticsProvider.setAccount({
		tracker:    'UA-71609511-3',
		trackEvent: true,
		fields: {
			cookieName:   'vknotice-analitics',
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
		const lang = getLang(stg.lang);

		if (lang !== 'ru') {
			$log.info('Current Language set as "' + lang + '"');
			gettextCatalog.setCurrentLanguage(lang);
		}
	});

	function getLang(lang_code) {
		switch (lang_code) {
		case 0: case 97: case 100: case 777:
			return 'ru'; // Русский
		case 1:
			return 'uk'; // Украинский
		case 2:  case 114:
			return 'be'; // Белорусский
		case 6:
			return 'de'; // Немецкий
		case 15:
			return 'pl'; // Польский
		case 54: case 66:
			return 'ro'; // Румынский
		case 61:
			return 'nl'; // Нидерландский
		default:
			return 'en'; // Английский
		}
	}
}]);
