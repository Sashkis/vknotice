var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl(storage, $routeParams) {
            var _this = this;
            this.storage = storage;
            this.$routeParams = $routeParams;
            this.dialogs = [];
            console.log($routeParams);
            storage.ready.then(function (stg) {
                _this.dialogs = angular.copy(stg.dialogs_cache);
            });
        }
        NewMessCtrl.prototype.getCurrentDialog = function () {
            if (!this.dialogs.length || !this.$routeParams.peer_id)
                return;
            var targetID = +this.$routeParams.peer_id;
            for (var i = 0; i < this.dialogs.length; i++) {
                if (targetID === this.dialogs[i].id)
                    return this.dialogs[i];
            }
        };
        NewMessCtrl.$inject = [
            'storage',
            '$routeParams',
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map