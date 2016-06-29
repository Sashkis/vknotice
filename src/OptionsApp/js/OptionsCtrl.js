var OptionsApp;
(function (OptionsApp) {
    var OptionsCtrl = (function () {
        function OptionsCtrl(storage, $scope, Analytics) {
            var _this = this;
            this.storage = storage;
            this.$scope = $scope;
            this.Analytics = Analytics;
            this.stg = {};
            this.options = {};
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.options = angular.copy(stg.options);
                _this.$scope.saveOptions = _this.saveOptions;
            });
        }
        OptionsCtrl.prototype.saveOptions = function () {
            var _this = this;
            this.Analytics.trackEvent('Activity', 'SaveOptions');
            this.storage.set({
                options: this.options,
            }, true, function () { return _this.$scope.$apply(); });
        };
        ;
        OptionsCtrl.$inject = [
            'storage',
            '$scope',
            'Analytics',
        ];
        return OptionsCtrl;
    }());
    OptionsApp.OptionsCtrl = OptionsCtrl;
})(OptionsApp || (OptionsApp = {}));
//# sourceMappingURL=OptionsCtrl.js.map