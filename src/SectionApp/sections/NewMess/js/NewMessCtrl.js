var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl(storage) {
            var _this = this;
            this.storage = storage;
            storage.ready.then(function (stg) {
                _this.dialogs = angular.copy(stg.dialogs_cache);
            });
        }
        NewMessCtrl.$inject = [
            'storage',
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map