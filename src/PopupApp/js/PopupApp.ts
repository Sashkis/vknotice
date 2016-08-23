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
		.controller('ContainerCtrl', ContainerCtrl)
		.filter('kFilter', function () {
		    return function (input: any, decimals: any) {
					const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];

		      if(isNaN(input)) return null;
		      if(input < 1000) return input;

					const exp = Math.floor(Math.log(input) / Math.log(1000));

		      return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
		    };
		  });;
}
