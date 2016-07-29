var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl($vk, storage, $stateParams) {
            var _this = this;
            this.$vk = $vk;
            this.storage = storage;
            storage.ready.then(function (stg) { return _this.stg = stg; });
            this.stateParams = $stateParams;
        }
        NewMessCtrl.prototype.markAsRead = function (peer_id) {
            var _this = this;
            this.$vk.auth().then(function () {
                _this.$vk.api('messages.markAsRead', {
                    access_token: _this.$vk.stg.access_token,
                    peer_id: peer_id,
                });
            });
        };
        NewMessCtrl.$inject = [
            '$vk',
            'storage',
            '$stateParams'
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map