angular.module('OptionsApp')
	.controller('OptionsCtrl', ['storage', '$log', '$scope', function (storage, $log, $scope) {
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
			storage.set({
				options: vm.options,
			}, () => {
				// vm.isOptionSaved = true;
				$scope.$apply();
			});
		};

		vm.isOptionSaved = function () {
			return angular.equals(vm.options, vm.stg.options);
		};

	}]);
