var VkApp;
(function (VkApp) {
    var VkService = (function () {
        function VkService($q, $http, storage, apiConfig, authConfig, $httpParamSerializer) {
            this.$q = $q;
            this.$http = $http;
            this.storage = storage;
            this.apiConfig = apiConfig;
            this.authConfig = authConfig;
            this.stg = {};
            this.authUrl = "https://oauth.vk.com/authorize?" + $httpParamSerializer(authConfig);
        }
        VkService.prototype.isAuth = function () {
            var _this = this;
            var ready = this.$q.defer();
            if (this.stg.access_token && this.stg.user_id) {
                this.api('users.get', { access_token: this.stg.access_token }).then(function (resp) {
                    ready.resolve(resp && resp[0] && resp[0].id && resp[0].id == _this.stg.user_id);
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
        VkService.prototype.isAuthSuccess = function (authData) {
            if (authData === void 0) { authData = {}; }
            return authData && authData.user_id
                && authData.access_token
                && authData.state
                && authData.state === 'vknotice';
        };
        VkService.prototype.auth = function () {
            var _this = this;
            var ready = this.$q.defer();
            this.storage.ready.then(function (stg) {
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
                                if (authTabId && authTabId === tabId
                                    && changeInfo.url
                                    && changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                                    var authData = _this.parseHashParams(changeInfo.url);
                                    if (!_this.isAuthSuccess(authData))
                                        return;
                                    _this.storage.set({
                                        user_id: +authData.user_id,
                                        access_token: authData.access_token,
                                    });
                                    !!authTabId && chrome.tabs.remove(authTabId);
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
        VkService.prototype.api = function (method, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            var ready = this.$q.defer();
            params.v = this.apiConfig.version;
            this.$http.get("https://api.vk.com/method/" + method, { params: params })
                .then(function (API) {
                if (_this.isResponseSuccess(API.data)) {
                    ready.resolve(API.data.response);
                }
                else {
                    if (API.data.error && API.data.error.error_code === 6) {
                        console.warn('Wait to restart');
                        setTimeout(function () {
                            console.warn('Restart');
                            _this.api(method, params).then(ready.resolve, ready.reject);
                        }, 2000);
                    }
                    else {
                        console.error(API.data.error);
                        ready.reject('api_error');
                    }
                }
            }, function () {
                ready.reject('connect_error');
            });
            return ready.promise;
        };
        VkService.prototype.isResponseSuccess = function (respData) {
            return angular.isDefined(respData.response);
        };
        VkService.$inject = [
            '$q',
            '$http',
            'storage',
            'apiConfig',
            'authConfig',
            '$httpParamSerializer',
        ];
        return VkService;
    }());
    VkApp.VkService = VkService;
})(VkApp || (VkApp = {}));
//# sourceMappingURL=VkService.js.map