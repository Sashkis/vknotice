var SectionsApp;
(function (SectionsApp) {
    var TabCtrl = (function () {
        function TabCtrl($scope, storage, $state) {
            var _this = this;
            storage.ready.then(function (stg) {
                _this.stg = stg;
            });
            $scope.$on('requestRemoved', function () {
                if (_this.stg && _this.stg.newfriends && _this.stg.newfriends.length === 1 && $state.is('friends.requests')) {
                    $state.go('friends.all');
                }
            });
        }
        TabCtrl.$inject = ['$scope', 'storage', '$state'];
        return TabCtrl;
    }());
    SectionsApp.TabCtrl = TabCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=TabCtrl.js.map