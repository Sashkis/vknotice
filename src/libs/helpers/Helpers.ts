module Helpers {
	export function trackPage (...dependency: Array<any>) {
		const [Analytics, storage] = dependency;
		storage.ready.then((stg: IStorageData) => {
			stg.user_id && Analytics.set('&uid', stg.user_id);
			let path = getPageTrackUrl();
			Analytics.trackPage(path);
		});
	}

	export function getPageTrackUrl () {
		switch (location.pathname) {
			case "/OptionsApp/index.html" : return '/Options/';
			case "/BackgroundApp/background.html" : return '/Background/';
		}
	}

	export function setCurrentLanguage (...dependency: Array<any>) {
		const [gettextCatalog, storage] = dependency;

		gettextCatalog.debug = true;
		console.log(gettextCatalog);
		gettextCatalog.baseLanguage = 'ru_RU';
		// gettextCatalog.currentLanguage = 'ru_RU';

		storage.ready.then((stg: IStorageData) => {
			const lang = getLang(stg.lang);

			gettextCatalog.setCurrentLanguage(lang);
			console.info(`Current Language set as "${lang}"`);
		});

	}

	function getLang(lang_code: number) {
		switch (lang_code) {
			case 0: case 97: case 100: case 777:
			return 'ru_RU'; // Русский
			case 1:
			return 'uk_UA'; // Украинский
			case 2:  case 114:
			return 'be_BY'; // Белорусский
			case 6:
			return 'de_DE'; // Немецкий
			case 15:
			return 'pl_PL'; // Польский
			case 54: case 66:
			return 'ro_RO'; // Румынский
			case 61:
			return 'nl_NL'; // Нидерландский
			default:
			return 'en_US'; // Английский
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
		.ignoreFirstPageLoad(true)
		.setRemoveRegExp(/[0-9]+/)
		.setHybridMobileSupport(true);
	}

	export function getReviewUrl () {
		return /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)
			? 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container'
			: 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews';
	}

	export function getShareUrl () {
		const injector = angular.injector(['ng', 'gettext']);
		const $httpParamSerializer = injector.get('$httpParamSerializer');
		const gettextCatalog: any = injector.get('gettextCatalog');
		return 'https://vk.com/share.php?' + $httpParamSerializer({
			'url'         : 'https://vk.com/note45421694_12011424',
			'title'       : gettextCatalog.getString('Информер Вконтакте'),
			'description' : gettextCatalog.getString('Отображает количество непрочитанных сообщений и позволяет ответить не заходя в ВК!'),
			'image'       : 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
			'noparse'     : 'true',
		});
	}
}
