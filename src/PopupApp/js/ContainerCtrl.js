var PopupApp;
(function (PopupApp) {
    var ContainerCtrl = (function () {
        function ContainerCtrl($scope, $vk, storage, Analytics) {
            var _this = this;
            this.$vk = $vk;
            this.storage = storage;
            this.Analytics = Analytics;
            storage.ready.then(function (stg) {
                _this.stg = stg;
                Analytics.set('&uid', stg.user_id);
                _this.deleteAlert();
            });
            $scope.$on('onAlertClick', function ($event, alert, isOpened) { return _this.onAlertClick(alert, isOpened); });
        }
        ContainerCtrl.prototype.auth = function () {
            this.Analytics.trackEvent('OAuth', 'login');
            chrome.runtime.reload();
        };
        ContainerCtrl.prototype.onAlertClick = function (alert, isOpened) {
            this.deleteAlert(true);
            this.Analytics.trackEvent('Alert', isOpened ? 'open' : 'ignore', alert.id);
        };
        ContainerCtrl.prototype.deleteAlert = function (isForse) {
            if (isForse)
                delete this.stg.alerts[0];
            else if (!this.stg.alerts[0])
                this.stg.alerts.shift();
            this.storage.set({
                alerts: this.stg.alerts
            });
        };
        ContainerCtrl.$inject = [
            '$scope',
            '$vk',
            'storage',
            'Analytics',
        ];
        return ContainerCtrl;
    }());
    PopupApp.ContainerCtrl = ContainerCtrl;
})(PopupApp || (PopupApp = {}));
//# sourceMappingURL=ContainerCtrl.js.map