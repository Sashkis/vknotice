angular.module('OptionsApp')
    .controller('OptionsCtrl', ['storage', 'Analytics', '$scope', function (storage, Analytics, $scope) {
        var vm = this;
        vm.stg = {
            options: {},
        };
        vm.options = {};
        storage.ready.then(function (stg) {
            vm.stg = stg;
            vm.options = angular.copy(stg.options);
        });
        vm.saveOptions = function () {
            Analytics.trackEvent('Activity', 'SaveOptions');
            storage.set({
                options: vm.options,
            }, function () { return $scope.$apply(); });
        };
        vm.clearData = function () {
            Analytics.trackEvent('Activity', 'ClearData');
        };
        vm.isOptionSaved = function () {
            return angular.equals(vm.options, vm.stg.options);
        };
    }]);
//# sourceMappingURL=OptionsCtrl.js.map