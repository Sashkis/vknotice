var SectionsApp;
(function (SectionsApp) {
    var SectionsCtrl = (function () {
        function SectionsCtrl(storage, Analytics, $state, $scope) {
            var _this = this;
            this.storage = storage;
            history.pushState({}, 'home', '/PopupApp/popup.html#/');
            storage.ready.then(function (stg) {
                $state.go(stg.state.name, stg.state.params);
            });
            $scope.$on('$stateChangeSuccess', function ($event, toState, toParams) { return _this.saveSection(toState, toParams); });
        }
        SectionsCtrl.prototype.saveSection = function (toState, toParams) {
            this.storage.set({
                state: {
                    name: toState.name,
                    params: toParams
                }
            });
        };
        SectionsCtrl.$inject = [
            'storage',
            'Analytics',
            '$state',
            '$scope',
        ];
        return SectionsCtrl;
    }());
    SectionsApp.SectionsCtrl = SectionsCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsCtrl.js.map