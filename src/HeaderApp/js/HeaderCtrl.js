var HeaderApp;
(function (HeaderApp) {
    var HeaderCtrl = (function () {
        function HeaderCtrl(storage, Analytics, $state) {
            var _this = this;
            this.storage = storage;
            this.Analytics = Analytics;
            this.$state = $state;
            this.shareUrl = Helpers.getShareUrl();
            this.reviewUrl = Helpers.getReviewUrl();
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.current_user = storage.getProfile(stg.user_id);
            });
        }
        HeaderCtrl.prototype.logout = function ($event) {
            var _this = this;
            $event.preventDefault();
            this.storage.set({
                user_id: 0,
                access_token: '',
            }, true, function () {
                _this.Analytics.trackEvent('OAuth', 'logout');
                chrome.browserAction.setBadgeText({ text: '' });
            });
        };
        HeaderCtrl.prototype.trackActivity = function (activity) {
            this.Analytics.trackEvent('Activity', activity, 'dropdown-menu');
        };
        HeaderCtrl.prototype.isHome = function () {
            var isHome = this.$state.is('home');
            return isHome === undefined ? true : isHome;
        };
        HeaderCtrl.prototype.openOptionsPage = function () {
            chrome.runtime.openOptionsPage();
        };
        HeaderCtrl.prototype.back = function () {
            window.history.back();
        };
        HeaderCtrl.$inject = [
            'storage',
            'Analytics',
            '$state',
        ];
        return HeaderCtrl;
    }());
    HeaderApp.HeaderCtrl = HeaderCtrl;
})(HeaderApp || (HeaderApp = {}));
//# sourceMappingURL=HeaderCtrl.js.map