module Helpers {
	export function trackPage (...dependency: Array<any>) {
		const [Analytics, storage] = dependency;
		storage.ready.then((stg: IStorageData) => {
			stg.user_id && Analytics.set('&uid', stg.user_id);
			let path = getPageTrackUrl();
			path = path === '/Popup/' && stg.currentSection ? path+stg.currentSection : path;
			Analytics.trackPage(path);
		});
	}

	export function getPageTrackUrl () {
		switch (location.pathname) {
			case "/OptionsApp/index.html" : return '/Options/';
			case "/BackgroundApp/background.html" : return '/Background/';
			case "/PopupApp/popup.html" : return '/Popup/';

		}
	}

	export function setCurrentLanguage (...dependency: Array<any>) {
		const [gettextCatalog, storage] = dependency;

		gettextCatalog.debug = false;

		storage.ready.then((stg: IStorageData) => {
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
