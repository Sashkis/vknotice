module Helpers {
	export function setCurrentLanguage (...dependency: Array<any>) {
		const [gettextCatalog, storage, Analytics] = dependency;

		gettextCatalog.debug = true;

		storage.ready.then((stg: IStorageData) => {
			Analytics.set('&uid', stg.user_id);
			Analytics.trackPage('/Options', 'Настройки');
			const lang = getLang(stg.lang);

			if (lang !== 'ru') {
				console.info('Current Language set as "' + lang + '"');
				gettextCatalog.setCurrentLanguage(lang);
			}
		});

	}

	function getLang(lang_code: number) {
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

	export function setAnaliticSetting (...dependency: Array<any>) {
		const [AnalyticsProvider] = dependency;

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
	}
}
