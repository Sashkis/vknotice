var VkApp;
(function (VkApp) {
    var VkService = (function () {
        function VkService($q, $http, $httpParamSerializer, storage, apiConfig, authConfig, $log) {
            this.$q = $q;
            this.$http = $http;
            this.$httpParamSerializer = $httpParamSerializer;
            this.storage = storage;
            this.apiConfig = apiConfig;
            this.authConfig = authConfig;
            this.$log = $log;
            this.authUrl = 'https://oauth.vk.com/authorize?' + $httpParamSerializer(authConfig);
        }
        VkService.prototype.isAuth = function () {
            var $vk = this;
            var ready = this.$q.defer();
            if ($vk.stg.access_token && $vk.stg.user_id) {
                $vk.api('users.get', { access_token: $vk.stg.access_token }).then(function (resp) {
                    ready.resolve(resp && resp[0] && resp[0].id && resp[0].id == $vk.stg.user_id);
                }, function () {
                    ready.resolve(false);
                });
            }
            else {
                ready.resolve(false);
            }
            return ready.promise;
        };
        VkService.prototype.parseHashParams = function (url) {
            var ret = {};
            var hash = url.split('#')[1].split('&');
            for (var i = hash.length; i--;) {
                if (!hash[i])
                    continue;
                var s = hash[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        };
        VkService.prototype.auth = function () {
            var _this = this;
            var ready = this.$q.defer();
            this.storage.ready.then(function (stg) {
                console.log(_this);
                _this.stg = stg;
                _this.isAuth().then(function (isAuth) {
                    if (isAuth) {
                        ready.resolve();
                    }
                    else {
                        chrome.tabs.create({
                            url: _this.authUrl,
                            active: true,
                        }, function (tab) {
                            var authTabId = tab.id;
                            var tabUpdateListener = function (tabId, changeInfo) {
                                if (tabId === authTabId
                                    && changeInfo.url
                                    && changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                                    var authData = _this.parseHashParams(changeInfo.url);
                                    _this.stg.user_id = authData.user_id;
                                    _this.stg.access_token = authData.access_token;
                                    _this.storage.set({
                                        user_id: _this.stg.user_id,
                                        access_token: _this.stg.access_token,
                                    });
                                    authTabId && chrome.tabs.remove(authTabId);
                                    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                                }
                            };
                            var tabRemovedListener = function (tabId) {
                                if (authTabId === tabId) {
                                    _this.isAuth().then(function (isAuth) {
                                        ready[isAuth ? 'resolve' : 'reject']();
                                        chrome.tabs.onRemoved.removeListener(tabRemovedListener);
                                    });
                                }
                            };
                            chrome.tabs.onUpdated.addListener(tabUpdateListener);
                            chrome.tabs.onRemoved.addListener(tabRemovedListener);
                        });
                    }
                });
            });
            return ready.promise;
        };
        VkService.prototype.api = function (method, data) {
            if (data === void 0) { data = {}; }
            var ready = this.$q.defer();
            data.v = this.apiConfig.version;
            this.$http.get('https://api.vk.com/method/' + method, { params: data })
                .then(function (API) {
                if (API.data && API.data.response) {
                    ready.resolve(API.data.response);
                }
                else if (API.data.error) {
                    this.$log.error(API.data.error);
                    ready.reject('api_error');
                }
            }, function () {
                ready.reject('connect_error');
            });
            return ready.promise;
        };
        VkService.$inject = [
            '$q',
            '$http',
            '$httpParamSerializer',
            'storage',
            'apiConfig',
            'authConfig',
            '$log',
        ];
        return VkService;
    }());
    VkApp.VkService = VkService;
})(VkApp || (VkApp = {}));
//# sourceMappingURL=VkService.js.map