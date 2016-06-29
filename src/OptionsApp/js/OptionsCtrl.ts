module OptionsApp {

	interface IOptionScope extends ng.IScope {
		saveOptions: () => void,
		// saveOptions: () => void,
	}

	export class OptionsCtrl {
		stg = <IStorageData>{};
		options = <IOptions>{};

		public static $inject = [
			'storage',
			'$scope',
			'Analytics',
		];

		constructor (private storage: StorageApp.StorageService, private $scope: IOptionScope, private Analytics: any) {
			storage.ready.then((stg) => {
				this.stg = stg;
				this.options = angular.copy(stg.options);
				this.$scope.saveOptions = this.saveOptions;
			});
		}

			saveOptions () {
				this.Analytics.trackEvent('Activity', 'SaveOptions');
				this.storage.set({
					options: this.options,
				}, true, () => this.$scope.$apply() );
			};
	}
}
	// .controller('OptionsCtrl', ['storage', 'Analytics', '$scope', function (storage, Analytics, $scope) {
	// 	const vm = this;
	//
	// 	vm.stg = {
	// 		options: {},
	// 	};
	// 	vm.options = {};
	// 	storage.ready.then((stg) => {
	// 		vm.stg = stg;
	// 		vm.options = angular.copy(stg.options);
	// 	});
	//
	// 	vm.saveOptions = function () {
	// 		Analytics.trackEvent('Activity', 'SaveOptions');
	// 		storage.set({
	// 			options: vm.options,
	// 		}, () => $scope.$apply() );
	// 	};
	//
	// 	vm.clearData = function () {
	// 		Analytics.trackEvent('Activity', 'ClearData');
	// 		// chrome.storage.local.clear();
	// 	};
	//
	// 	vm.isOptionSaved = function () {
	// 		return angular.equals(vm.options, vm.stg.options);
	// 	};
	//
	// }]);
