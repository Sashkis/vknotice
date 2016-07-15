var SectionsApp;
(function (SectionsApp) {
    var SectionsCtrl = (function () {
        function SectionsCtrl(storage, Analytics, $location, $window, $scope) {
            var _this = this;
            this.storage = storage;
            this.Analytics = Analytics;
            this.$location = $location;
            this.$window = $window;
            storage.ready.then(function (stg) {
                Analytics.set('&uid', stg.user_id);
                if (stg.currentSection !== '/') {
                    $location.url(stg.currentSection);
                }
            });
            $scope.$on('$locationChangeSuccess', function () { return _this.saveSection(); });
        }
        SectionsCtrl.prototype.isNoRoot = function () {
            return this.$location.url() !== '/';
        };
        SectionsCtrl.prototype.back = function () {
            if (this.$window.history.length > 1)
                this.$window.history.back();
            else
                this.$location.url('/');
        };
        SectionsCtrl.prototype.saveSection = function () {
            this.storage.set({
                currentSection: this.$location.url()
            });
        };
        SectionsCtrl.$inject = [
            'storage',
            'Analytics',
            '$location',
            '$window',
            '$scope',
        ];
        return SectionsCtrl;
    }());
    SectionsApp.SectionsCtrl = SectionsCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SectionsCtrl.js.map