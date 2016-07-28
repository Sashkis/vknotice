var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl(storage, $vk, $scope, deamon, messMap) {
            var _this = this;
            this.storage = storage;
            this.$vk = $vk;
            this.$scope = $scope;
            this.deamon = deamon;
            this.messMap = messMap;
            this.isMore = false;
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.currentMessMap = messMap.getMessMap();
                if (_this.currentMessMap) {
                    var targetPeer_id_1 = _this.currentMessMap.peer_id;
                    $vk.auth().then(function () {
                        _this.loadHistory(targetPeer_id_1).then(function (API) {
                            storage.setProfiles(API.profiles);
                            messMap.insertMessages(targetPeer_id_1, API.history.items);
                            messMap.setMore(targetPeer_id_1, API.history.count);
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
        NewMessCtrl.prototype.loadHistory = function (peer_id, offset, count) {
            if (offset === void 0) { offset = 0; }
            if (count === void 0) { count = 20; }
            return this.$vk.api('execute.getHistory', {
                access_token: this.$vk.stg.access_token,
                peer_id: peer_id,
                count: count,
                offset: offset,
            });
        };
        NewMessCtrl.prototype.loadMore = function (peer_id) {
            var _this = this;
            var targetMessMap = this.messMap.getMessMap(peer_id);
            if (!targetMessMap)
                return;
            var offset = targetMessMap.items ? targetMessMap.items.length : 0;
            this.loadHistory(peer_id, offset).then(function (API) {
                _this.messMap.insertMessages(peer_id, API.history.items, false);
            });
        };
        NewMessCtrl.prototype.onLongPollDone = function (API) {
            var _this = this;
            this.LongPollParams.pts = API.new_pts;
            if (angular.isArray(API.profiles)) {
                this.storage.setProfiles(API.profiles);
            }
            if (!this.currentMessMap)
                return true;
            angular.forEach(API.history, function (event) {
                switch (event[0]) {
                    case 4:
                        var event_code = event[0], message_id_1 = event[1], flags = event[2], peer_id = event[3];
                        var message = API.messages.items.find(function (m) { return m.id === message_id_1; });
                        _this.messMap.insertMessages(peer_id, [message], false, true);
                        break;
                    default:
                        console.log(event);
                }
            });
            return true;
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
            if (!this.currentMessMap)
                return;
            var peer_id = this.currentMessMap.peer_id;
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
            '$vk',
            '$scope',
            'deamon',
            'messMap',
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map