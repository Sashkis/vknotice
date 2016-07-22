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
                    var targetID_1 = _this.currentDialog.peer_id;
                    $vk.auth().then(function () {
                        $vk.api('messages.getHistory', {
                            access_token: $vk.stg.access_token,
                            peer_id: targetID_1,
                            count: 100,
                        }).then(function (API) {
                            if (_this.currentDialog) {
                                _this.currentDialog.unread = API.unread || 0;
                                _this.currentDialog.message = API.items.map(function (mess) { return new SectionsApp.Message(mess); });
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
        NewMessCtrl.prototype.sendMessage = function () {
            var _this = this;
            if (!this.currentDialog)
                return;
            var peer_id = this.currentDialog.peer_id;
            var message = this.message;
            this.$vk.auth().then(function () {
                _this.$vk.api('messages.send', {
                    access_token: _this.$vk.stg.access_token,
                    message: message,
                    peer_id: peer_id,
                }).then(function (API) {
                    if (_this.currentDialog && _this.currentDialog.peer_id === peer_id) {
                        if (!_this.currentDialog.message)
                            _this.currentDialog.message = [];
                        _this.currentDialog.message.unshift(new SectionsApp.Message({
                            id: API,
                            body: message,
                            user_id: _this.$vk.stg.user_id,
                            from_id: _this.$vk.stg.user_id,
                            out: 1,
                            date: Math.round(Date.now() / 1000),
                            read_state: 0,
                        }));
                    }
                    _this.message = '';
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