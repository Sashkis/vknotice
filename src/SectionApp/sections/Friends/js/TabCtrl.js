var SectionsApp;
(function (SectionsApp) {
    var TabCtrl = (function () {
        function TabCtrl($scope, storage, $state) {
            var _this = this;
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.requests = stg.newfriends.length;
            });
            $scope.$on('requestRemoved', function () {
                _this.requests--;
                if ($state.is('friends.requests') && _this.requests === 0) {
                    $state.go('friends.all', null, { location: 'replace' });
                }
            });
        }
        TabCtrl.$inject = ['$scope', 'storage', '$state'];
        return TabCtrl;
    }());
    SectionsApp.TabCtrl = TabCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=TabCtrl.js.map