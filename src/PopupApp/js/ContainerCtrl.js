var PopupApp;
(function (PopupApp) {
    var ContainerCtrl = (function () {
        function ContainerCtrl($vk, storage) {
            var _this = this;
            this.$vk = $vk;
            this.storage = storage;
            storage.ready.then(function (stg) { return _this.stg = stg; });
        }
        ContainerCtrl.prototype.isAuth = function () {
            return !!(this.$vk.stg && this.$vk.stg.access_token && this.$vk.stg.user_id);
        };
        ContainerCtrl.prototype.auth = function () {
            chrome.runtime.reload();
        };
        ContainerCtrl.$inject = [
            '$vk',
            'storage',
        ];
        return ContainerCtrl;
    }());
    PopupApp.ContainerCtrl = ContainerCtrl;
})(PopupApp || (PopupApp = {}));
//# sourceMappingURL=ContainerCtrl.js.map