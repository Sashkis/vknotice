var HeaderApp;
(function (HeaderApp) {
    var HeaderCtrl = (function () {
        function HeaderCtrl(storage, Analytics, $httpParamSerializer, gettextCatalog) {
            var _this = this;
            this.storage = storage;
            this.Analytics = Analytics;
            this.optionUrl = chrome.extension.getURL('OptionsApp/index.html');
            this.shareUrl = 'https://vk.com/share.php?' + $httpParamSerializer({
                'url': 'http://vk.com/note45421694_12011424',
                'title': gettextCatalog.getString('Информер Вконтакте'),
                'description': gettextCatalog.getString('Отображает количество непрочитанных сообщений и позволяет ответить не заходя в ВК!'),
                'image': 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
                'noparse': 'true',
            });
            this.reviewUrl = /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)
                ? 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container'
                : 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews';
            storage.ready.then(function (stg) {
                _this.stg = stg;
                _this.current_user = storage.getProfile(stg.user_id);
            });
        }
        HeaderCtrl.prototype.logout = function ($event) {
            $event.preventDefault();
            this.storage.set({
                user_id: 0,
                access_token: '',
            });
        };
        HeaderCtrl.prototype.trackActivity = function (activity) {
            this.Analytics.trackEvent('Activity', activity, 'dropdown-menu');
        };
        HeaderCtrl.$inject = [
            'storage',
            'Analytics',
            '$httpParamSerializer',
            'gettextCatalog',
        ];
        return HeaderCtrl;
    }());
    HeaderApp.HeaderCtrl = HeaderCtrl;
})(HeaderApp || (HeaderApp = {}));
//# sourceMappingURL=HeaderCtrl.js.map