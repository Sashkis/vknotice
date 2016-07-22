angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
	.config(['AnalyticsProvider', Helpers.setAnaliticSetting])
	.run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
	.run(['storage',
		(storage: StorageApp.StorageService) =>
			storage.onChanged((changes) =>
				angular.forEach(changes, (change, key) =>
					storage.stg[key] = angular.copy(change.newValue)
				)
			)
	]);
