var SectionsApp;
(function (SectionsApp) {
    var TabCtrl = (function () {
        function TabCtrl(storage, $vk) {
            var _this = this;
            this.storage = storage;
            this.$vk = $vk;
            storage.ready.then(function (stg) {
                _this.stg = stg;
            });
        }
        TabCtrl.$inject = ['storage'];
        return TabCtrl;
    }());
    SectionsApp.TabCtrl = TabCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=TabCtrl.js.map