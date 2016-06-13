angular.module('OptionsApp')
	.controller('OptionsCtrl', ['storage', 'Analytics', '$scope', function (storage, Analytics, $scope) {
		const vm = this;

		vm.stg = {
			options: {},
		};
		vm.options = {};
		storage.ready.then((stg) => {
			vm.stg = stg;
			vm.options = angular.copy(stg.options);
		});

		vm.saveOptions = function () {
			Analytics.trackEvent('Activity', 'SaveOptions');
			storage.set({
				options: vm.options,
			}, () => $scope.$apply() );
		};

		vm.clearData = function () {
			Analytics.trackEvent('Activity', 'ClearData');
			chrome.storage.local.clear();
		};

		vm.isOptionSaved = function () {
			return angular.equals(vm.options, vm.stg.options);
		};

	}]);
