var SectionsApp;
(function (SectionsApp) {
    var FriendsCtrl = (function () {
        function FriendsCtrl(storage) {
            var _this = this;
            storage.ready.then(function (stg) {
                var friends = angular.copy(stg.friends);
                _this.friends = {
                    count: friends.count,
                    items: friends.items.map(function (id) { return storage.getProfile(id); }),
                };
            });
        }
        FriendsCtrl.$inject = ['storage'];
        return FriendsCtrl;
    }());
    SectionsApp.FriendsCtrl = FriendsCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=FriendsCtrl.js.map