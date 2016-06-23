var BgApp;
(function (BgApp_1) {
    var BgApp = (function () {
        function BgApp(storage, deamon, Config, Analytics) {
            this.storage = storage;
            this.deamon = deamon;
            this.Config = Config;
            this.Analytics = Analytics;
        }
        BgApp.$inject = [
            'storage',
            'deamon',
            'Config',
            'Analytics',
        ];
        return BgApp;
    }());
})(BgApp || (BgApp = {}));
//# sourceMappingURL=BgClass.js.map