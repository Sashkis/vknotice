var StorageApp;
(function (StorageApp) {
    var StorageService = (function () {
        function StorageService($q, $rootScope) {
            var _this = this;
            var Promise = $q.defer();
            this.$rootScope = $rootScope;
            this.ready = Promise.promise;
            chrome.storage.local.get(function (stg) {
                _this.stg = angular.copy(stg);
                $rootScope.$apply();
                Promise.resolve(_this.stg);
            });
        }
        StorageService.prototype.onChanged = function (callback) {
            var _this = this;
            chrome.storage.onChanged.addListener(function (changes) {
                callback(changes, _this.stg);
                _this.$rootScope.$apply();
            });
        };
        StorageService.prototype.set = function (data, callback) {
            if (callback === void 0) { callback = function () { }; }
            angular.extend(this.stg, angular.copy(data));
            chrome.storage.local.set(data, callback);
        };
        StorageService.prototype.getProfileIndex = function (id) {
            if (id && this.stg
                && this.stg.profiles) {
                for (var i = 0; i < this.stg.profiles.length; i++) {
                    if (this.stg.profiles[i].id == id)
                        return i;
                }
            }
            return -1;
        };
        StorageService.prototype.getProfile = function (id) {
            var index = this.getProfileIndex(id);
            return (index >= 0 && this.stg.profiles && this.stg.profiles[index]) ? this.stg.profiles[index] : {};
        };
        StorageService.prototype.setProfiles = function (array) {
            var _this = this;
            if (!angular.isArray(array))
                return;
            array.map(function (profile) {
                if (!profile || !profile.id)
                    return;
                var index = _this.getProfileIndex(profile.id);
                if (!_this.stg.profiles)
                    _this.stg.profiles = [];
                if (index >= 0) {
                    _this.stg.profiles[index] = profile;
                }
                else {
                    _this.stg.profiles.unshift(profile);
                }
            });
        };
        StorageService.prototype.clearProfiles = function (limit) {
            if (limit === 0 || !this.stg.profiles)
                return this.stg.profiles = [];
            this.stg.profiles = this.stg.profiles.filter(function (profile) { return profile && profile.id; });
            if (this.stg.profiles.length > limit)
                return this.stg.profiles = this.stg.profiles.slice(0, limit);
            return this.stg.profiles;
        };
        return StorageService;
    }());
    StorageApp.StorageService = StorageService;
})(StorageApp || (StorageApp = {}));
//# sourceMappingURL=StorageClass.js.map