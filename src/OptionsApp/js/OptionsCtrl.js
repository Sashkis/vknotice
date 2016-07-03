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
            });
            VK.Widgets.Group("vk_groups", {
                mode: 2,
                height: document.getElementById('vk_groups').offsetHeight,
                width: 'auto'
            }, 90041499);
        }
        OptionsCtrl.prototype.saveOptions = function () {
            var _this = this;
            console.log(this);
            this.Analytics.trackEvent('Activity', 'SaveOptions');
            this.storage.set({
                options: this.options,
            }, true, function () { return _this.$scope.$apply(); });
        };
        ;
        OptionsCtrl.prototype.isOptionSaved = function () {
            return angular.equals(this.options, this.stg.options);
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