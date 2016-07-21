var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl(storage, $routeParams, $vk, $scope) {
            var _this = this;
            this.storage = storage;
            this.$routeParams = $routeParams;
            this.$vk = $vk;
            this.$scope = $scope;
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.currentDialog = _this.getCurrentDialog();
                if (_this.currentDialog) {
                    $vk.auth().then(function () {
                        console.log(_this.currentDialog);
                        $vk.api('messages.getHistory', {
                            access_token: $vk.stg.access_token,
                            peer_id: _this.currentDialog.peer_id,
                            count: 100,
                        }).then(function (API) {
                            if (_this.currentDialog) {
                                _this.currentDialog.unread = API.unread | 0;
                                _this.currentDialog.message = API.items;
                                var sel = "message-" + _this.currentDialog.message[_this.currentDialog.message.length - 1].id;
                                var a = document.getElementById(sel);
                                console.log(sel, a);
                            }
                        });
                    });
                }
            });
        }
        NewMessCtrl.prototype.getCurrentDialog = function () {
            if (!this.stg || !this.stg.dialogs.length || !this.$routeParams.peer_id)
                return;
            var targetID = +this.$routeParams.peer_id;
            for (var i = 0; i < this.stg.dialogs.length; i++) {
                if (targetID === this.stg.dialogs[i].peer_id)
                    return this.stg.dialogs[i];
            }
        };
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
            'storage',
            '$routeParams',
            '$vk',
            '$scope',
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map