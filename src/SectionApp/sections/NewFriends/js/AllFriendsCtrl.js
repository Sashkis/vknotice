var SectionsApp;
(function (SectionsApp) {
    var AllFriendsCtrl = (function () {
        function AllFriendsCtrl($vk) {
            var _this = this;
            this.$vk = $vk;
            console.log('constructor');
            $vk.auth().then(function () { return _this.updateUser(); });
        }
        AllFriendsCtrl.prototype.updateUser = function () {
            var _this = this;
            console.log('updateUser');
            return this.$vk.api('friends.get', {
                access_token: this.$vk.stg.access_token,
                order: 'hints',
                fields: 'online,photo_50',
                count: 500
            }).then(function (API) {
                _this.friends = API.items;
                return API;
            });
        };
        AllFriendsCtrl.$inject = [
            '$vk'
        ];
        return AllFriendsCtrl;
    }());
    SectionsApp.AllFriendsCtrl = AllFriendsCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=AllFriendsCtrl.js.map