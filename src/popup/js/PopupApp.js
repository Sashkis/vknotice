angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext'])
.run(function (gettextCatalog, storage) {

    gettextCatalog.setCurrentLanguage('uk');
	gettextCatalog.debug = true;

	storage.defer.then(function (stg) {
		console.log('PopupApp.js', stg);
	});
});