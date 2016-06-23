var DeamonApp;
(function (DeamonApp) {
    var DeamonService = (function () {
        function DeamonService($vk, $timeout) {
            this.$vk = $vk;
            this.$timeout = $timeout;
            this.isStarted = false;
            this.interval = 2000;
            this.DoneCB = function (resp) { return true; };
            this.FailCB = function (error) { return false; };
        }
        DeamonService.prototype.setConfig = function (config) {
            this.method = config.method || this.method;
            this.params = config.params || this.params;
            this.interval = config.interval || this.interval;
            this.DoneCB = config.DoneCB || this.DoneCB;
            this.FailCB = config.FailCB || this.FailCB;
            return this;
        };
        DeamonService.prototype.start = function () {
            this.isStarted = true;
            this.sendRequest();
            return this;
        };
        DeamonService.prototype.stop = function () {
            this.isStarted = false;
            this.$timeout.cancel(this.timeoutID);
            return this;
        };
        DeamonService.prototype.sendRequest = function () {
            var _this = this;
            if (!this.isStarted)
                return this.stop();
            var method = typeof this.method === 'function' ? this.method() : this.method;
            var params = typeof this.params === 'function' ? this.params() : this.params;
            this.$vk.api(method, params).then(function (resp) {
                _this.DoneCB(resp) ? _this.restart() : _this.stop();
            }, function (error) {
                _this.FailCB(error) ? _this.restart() : _this.stop();
            });
            return this;
        };
        DeamonService.prototype.restart = function () {
            var _this = this;
            if (!this.isStarted)
                return this.stop();
            this.timeoutID = this.$timeout(function () { _this.sendRequest(); }, this.interval, false);
            return this;
        };
        DeamonService.$inject = [
            '$vk',
            '$timeout',
        ];
        return DeamonService;
    }());
    DeamonApp.DeamonService = DeamonService;
})(DeamonApp || (DeamonApp = {}));
//# sourceMappingURL=DeamonService.js.map