module PopupApp {
	angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
		.config(Helpers.setAnaliticSetting)
		.run(Helpers.setCurrentLanguage)
		.run(['storage',
			(storage: StorageApp.StorageService) =>
			storage.onChanged((changes) =>
				angular.forEach(changes, (change, key) =>
					storage.stg[key] = angular.copy(change.newValue)
				)
			)
		])
		.directive('vkHref', vkHrefDirective)
		.directive('alert', alertDirective)
		.controller('ContainerCtrl', ContainerCtrl);
}
