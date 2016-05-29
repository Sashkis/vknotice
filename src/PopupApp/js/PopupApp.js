angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext'])
.run(['gettextCatalog', 'storage', '$log',
function (gettextCatalog, storage, $log) {

	gettextCatalog.debug = true;

	storage.ready.then(function (stg) {
		var lang = getLang(stg.lang);
		if (lang !== 'ru') {
			$log.info('Current Language set as "' + lang + '"');
			gettextCatalog.setCurrentLanguage(lang);
		}

		function getLang(lang_code) {
			switch (lang_code) {
			case 0: case 97: case 100: case 777:
				return 'ru';  // Русский
			case 1:
				return 'uk';  // Украинский
			case 2: case 114:
				return 'be';  // Белорусский
			case 6:
				return 'de';  // Немецкий
			case 15:
				return 'pl'; // Польский
			case 54: case 66:
				return 'ro'; // Румынский
			case 61:
				return 'nl'; // Нидерландский
			default:
				return 'en';  // Английский
			}
		}
	});
}]);
