var OptionsApp;
(function (OptionsApp) {
    var OptionsCtrl = (function () {
        function OptionsCtrl(storage, $scope, Analytics, gettextCatalog) {
            var _this = this;
            this.storage = storage;
            this.$scope = $scope;
            this.Analytics = Analytics;
            this.gettextCatalog = gettextCatalog;
            this.stg = {};
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.options = angular.copy(stg.options);
            });
            VK.Widgets.Group("vk_groups", {
                redesign: 1,
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
        OptionsCtrl.prototype.isOptionNotSaved = function () {
            return !angular.equals(this.options, this.stg.options);
        };
        ;
        OptionsCtrl.prototype.clearData = function () {
            if (confirm(this.gettextCatalog.getString('Данное действие удалит весь кэш и сбросит настройки.\nВы уверены, что хотите сделать это?'))) {
                this.Analytics.trackEvent('Activity', 'ClearData');
                this.storage.clear(function () { return chrome.runtime.reload(); });
            }
        };
        ;
        OptionsCtrl.$inject = [
            'storage',
            '$scope',
            'Analytics',
            'gettextCatalog',
        ];
        return OptionsCtrl;
    }());
    OptionsApp.OptionsCtrl = OptionsCtrl;
})(OptionsApp || (OptionsApp = {}));
//# sourceMappingURL=OptionsCtrl.js.map