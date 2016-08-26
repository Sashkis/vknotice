var SectionsApp;
(function (SectionsApp) {
    var NewFriendsCtrl = (function () {
        function NewFriendsCtrl(storage, $vk) {
            var _this = this;
            this.storage = storage;
            this.$vk = $vk;
            storage.ready.then(function (stg) {
                _this.stg = stg;
            });
        }
        NewFriendsCtrl.prototype.mark = function ($event, type, user_id) {
            var _this = this;
            $event.preventDefault();
            var method;
            switch (type) {
                case 'add':
                    method = 'friends.add';
                    break;
                case 'delete':
                    method = 'friends.delete';
                    break;
                case 'ban':
                    method = 'account.banUser';
                    break;
                default: method = '';
            }
            if (method) {
                this.$vk.auth().then(function () {
                    _this.$vk.api(method, {
                        user_id: user_id,
                        access_token: _this.$vk.stg.access_token,
                    });
                });
            }
        };
        NewFriendsCtrl.$inject = ['storage', '$vk'];
        return NewFriendsCtrl;
    }());
    SectionsApp.NewFriendsCtrl = NewFriendsCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewFriendsCtrl.js.map