var SectionsApp;
(function (SectionsApp) {
    var ChatCtrl = (function () {
        function ChatCtrl(storage, $vk, $scope, deamon, messMap, $stateParams) {
            var _this = this;
            this.storage = storage;
            this.$vk = $vk;
            this.$scope = $scope;
            this.deamon = deamon;
            this.messMap = messMap;
            this.$stateParams = $stateParams;
            this.isMore = false;
            storage.ready.then(function (stg) {
                _this.currentMessMap = messMap.getMessMap();
                if (_this.currentMessMap) {
                    var targetPeer_id_1 = _this.currentMessMap.peer_id;
                    $vk.auth().then(function () {
                        _this.loadMore(targetPeer_id_1).then(function (API) {
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
                            $scope.$on('$stateChangeSuccess', function ($event, toState, toParams) {
                                _this.currentMessMap = messMap.getMessMap(+toParams.peer_id);
                                if (toParams.peer_id)
                                    _this.loadMore(+toParams.peer_id);
                            });
                        });
                    });
                }
            });
        }
        ChatCtrl.prototype.isGroup = function () {
            var peer_id = +this.$stateParams.peer_id;
            if (!peer_id)
                return false;
            var dialog = this.storage.stg.dialogs.find(function (d) { return d.peer_id === peer_id; });
            if (!dialog)
                return false;
            return dialog.type === 1;
        };
        ChatCtrl.prototype.loadHistory = function (peer_id, offset, count) {
            if (offset === void 0) { offset = 0; }
            if (count === void 0) { count = 20; }
            return this.$vk.api('execute.getHistory', {
                access_token: this.$vk.stg.access_token,
                peer_id: peer_id,
                count: count,
                offset: offset,
            });
        };
        ChatCtrl.prototype.loadMore = function (peer_id) {
            var _this = this;
            var targetMessMap = this.messMap.getMessMap(peer_id);
            var offset = targetMessMap && targetMessMap.items ? targetMessMap.items.length : 0;
            return this.loadHistory(peer_id, offset).then(function (API) {
                _this.storage.setProfiles(API.profiles);
                _this.messMap.insertMessages(peer_id, API.history.items);
                _this.messMap.setMore(peer_id, API.history.count);
                return API;
            });
        };
        ChatCtrl.prototype.onLongPollDone = function (API) {
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
                        {
                            var event_code = event[0], message_id_1 = event[1], flags = event[2], peer_id = event[3];
                            var message = API.messages.items.find(function (m) { return m.id === message_id_1; });
                            _this.messMap.insertMessages(peer_id, [message], true);
                        }
                        break;
                    case 6:
                    case 7:
                        {
                            var event_code_1 = event[0], peer_id = event[1], local_id_1 = event[2];
                            var messMap = _this.messMap.getMessMap(peer_id);
                            if (messMap)
                                messMap.items.filter(function (m) { return m.out === (event_code_1 === 6 ? 0 : 1) && m.id <= local_id_1; }).map(function (m) { return m.read_state = 1; });
                        }
                        break;
                    default:
                }
            });
            return true;
        };
        ChatCtrl.prototype.sendMessage = function ($event) {
            var _this = this;
            if (!this.currentMessMap || !this.message)
                return;
            if ($event.ctrlKey) {
                this.message += "\n";
                return;
            }
            $event.preventDefault();
            var peer_id = this.currentMessMap.peer_id;
            var message = this.message;
            this.$vk.auth().then(function () { return _this.$vk.api('messages.send', {
                access_token: _this.$vk.stg.access_token,
                message: message,
                peer_id: peer_id,
            }); }).then(function (API) {
                _this.message = '';
            });
        };
        ChatCtrl.$inject = [
            'storage',
            '$vk',
            '$scope',
            'deamon',
            'messMap',
            '$stateParams',
        ];
        return ChatCtrl;
    }());
    SectionsApp.ChatCtrl = ChatCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=ChatCtrl.js.map