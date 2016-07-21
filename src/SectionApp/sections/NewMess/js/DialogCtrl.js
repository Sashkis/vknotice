var SectionsApp;
(function (SectionsApp) {
    var DialogCtrl = (function () {
        function DialogCtrl(storage, $attrs, $scope) {
            this.storage = storage;
            this.$attrs = $attrs;
            this.$scope = $scope;
            console.log(this);
        }
        DialogCtrl.$inject = [
            'storage',
            '$attrs',
            '$scope',
        ];
        return DialogCtrl;
    }());
    SectionsApp.DialogCtrl = DialogCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=DialogCtrl.js.map