angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext'])
.run(function (gettextCatalog, storage) {

	gettextCatalog.debug = true;

	storage.onLoad.then(function (stg) {
		const lang = getLang(stg.lang);
		console.log('PopupApp.js', lang);
		if (lang !== 'ru') {
			gettextCatalog.setCurrentLanguage(lang);
		}

		function getLang(lang_code) {
			switch (lang_code) {
				case 0: case 97: case 100: case 777:
					return 'ru';  // Русский
				case 1:
					return 'uk';  // Украинский
				case 2: case 114:
					return 'be';  // Белоруский
				case 6:
					return 'de';  // Немецкий
				case 15:
					return 'pl'; // Польский
				case 54: case 66:
					return 'ro'; // Румунский
				case 61:
					return 'nl'; // Нидерландский
				default:
					return 'en';  // Английский
			}
		}
	});
});