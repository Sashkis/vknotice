var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl(storage, $routeParams, $vk, $scope, deamon) {
            var _this = this;
            this.storage = storage;
            this.$routeParams = $routeParams;
            this.$vk = $vk;
            this.$scope = $scope;
            this.deamon = deamon;
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.currentDialog = _this.getCurrentDialog();
                if (_this.currentDialog) {
                    var targetID_1 = _this.currentDialog.peer_id;
                    $vk.auth().then(function () {
                        $vk.api('execute.getHistory', {
                            access_token: $vk.stg.access_token,
                            peer_id: targetID_1,
                            count: 100,
                        }).then(function (API) {
                            storage.setProfiles(API.profiles);
                            if (_this.currentDialog && _this.currentDialog.peer_id === targetID_1) {
                                _this.currentDialog.unread = API.history.unread || 0;
                                _this.currentDialog.message = API.history.items.map(function (mess) { return new SectionsApp.Message(mess); });
                            }
                            _this.LongPollParams = {
                                access_token: $vk.stg.access_token,
                                ts: API.server.ts,
                                pts: API.server.pts,
                                fields: 'screen_name,status,photo_50,online',
                            };
                            deamon
                                .setConfig({
                                method: 'messages.getLongPollHistory',
                                params: _this.LongPollParams,
                                interval: 1000,
                                DoneCB: function (resp) { return _this.onLongPollDone(resp); },
                            })
                                .start();
                            $scope.$on('$destroy', function () {
                                deamon.stop();
                            });
                        });
                    });
                }
            });
        }
        NewMessCtrl.prototype.onLongPollDone = function (API) {
            var _this = this;
            this.LongPollParams.pts = API.new_pts;
            if (angular.isArray(API.profiles)) {
                this.storage.setProfiles(API.profiles);
            }
            if (!this.currentDialog)
                return true;
            var targetID = this.currentDialog.peer_id;
            angular.forEach(API.history, function (event) {
                switch (event[0]) {
                    case 4:
                        var event_code = event[0], message_id_1 = event[1], flags = event[2], peer_id = event[3];
                        if (peer_id !== targetID || !_this.currentDialog)
                            return;
                        var message = new SectionsApp.Message(API.messages.items.find(function (mess) { return mess.id === message_id_1; }));
                        if (!_this.currentDialog.message)
                            _this.currentDialog.message = [];
                        _this.currentDialog.message.unshift(message);
                        break;
                    default:
                        console.log(event);
                }
            });
            return true;
        };
        NewMessCtrl.prototype.getCurrentDialog = function () {
            if (!this.stg || !this.stg.dialogs.length || !this.$routeParams.peer_id)
                return;
            var targetID = +this.$routeParams.peer_id;
            return this.stg.dialogs.find(function (dialog) { return targetID === dialog.peer_id; });
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
                    _this.message = '';
                });
            });
        };
        NewMessCtrl.$inject = [
            'storage',
            '$routeParams',
            '$vk',
            '$scope',
            'deamon',
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map