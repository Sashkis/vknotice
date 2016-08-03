var SectionsApp;
(function (SectionsApp) {
    var SectionsCtrl = (function () {
        function SectionsCtrl(storage, Analytics, $state, $scope) {
            var _this = this;
            this.storage = storage;
            storage.ready.then(function (stg) {
                if (stg.state.params.peer_id) {
                    var targetDialog = stg.dialogs.find(function (d) { return d.peer_id === stg.state.params.peer_id; });
                    if (!targetDialog) {
                        stg.state.name = 'dialogs';
                        delete stg.state.params.peer_id;
                    }
                }
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