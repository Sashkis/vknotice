var StorageApp;
(function (StorageApp) {
    (function (AudioOptionStatus) {
        AudioOptionStatus[AudioOptionStatus["Never"] = 0] = "Never";
        AudioOptionStatus[AudioOptionStatus["SomeConditions"] = 1] = "SomeConditions";
        AudioOptionStatus[AudioOptionStatus["Always"] = 2] = "Always";
    })(StorageApp.AudioOptionStatus || (StorageApp.AudioOptionStatus = {}));
    var AudioOptionStatus = StorageApp.AudioOptionStatus;
    var StorageService = (function () {
        function StorageService($q, $rootScope, DefaultStorage) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.stg = {};
            var Promise = $q.defer();
            this.ready = Promise.promise;
            chrome.storage.local.get(DefaultStorage, function (stg) {
                _this.stg = angular.copy(stg);
                $rootScope.$apply();
                Promise.resolve(_this.stg);
            });
        }
        StorageService.prototype.onChanged = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = function (changes, stg) { }; }
            chrome.storage.onChanged.addListener(function (changes) {
                callback(changes, _this.stg);
                _this.$rootScope.$apply();
            });
        };
        StorageService.prototype.set = function (data, needSaveInCrrome, callback) {
            if (needSaveInCrrome === void 0) { needSaveInCrrome = true; }
            if (callback === void 0) { callback = function () { }; }
            angular.extend(this.stg, angular.copy(data));
            needSaveInCrrome && chrome.storage.local.set(data, callback);
        };
        StorageService.prototype.getProfileIndex = function (id) {
            if (id && this.stg
                && this.stg.profiles) {
                for (var i = 0; i < this.stg.profiles.length; i++) {
                    if (this.stg.profiles[i].id === id)
                        return i;
                }
            }
            return -1;
        };
        StorageService.prototype.getProfile = function (id) {
            var index = this.getProfileIndex(id);
            return (index >= 0 && this.stg.profiles && this.stg.profiles[index]) ? this.stg.profiles[index] : {};
        };
        StorageService.prototype.setProfiles = function (newProfiles) {
            var _this = this;
            if (!this.stg.profiles)
                this.initEmptyProfilesCash();
            var needSearch = this.stg.profiles.length > 0;
            if (!angular.isArray(newProfiles))
                return this.stg.profiles;
            newProfiles.map(function (profile) {
                if (!profile || !profile.id)
                    return;
                var index = needSearch ? _this.getProfileIndex(profile.id) : -1;
                if (index >= 0) {
                    _this.stg.profiles[index] = profile;
                }
                else {
                    _this.stg.profiles.unshift(profile);
                }
            });
            this.set({ profiles: this.stg.profiles });
            return this.stg.profiles;
        };
        StorageService.prototype.clearProfiles = function (limit) {
            if (!limit || !this.stg.profiles)
                return this.initEmptyProfilesCash();
            this.stg.profiles = this.stg.profiles.filter(function (profile) { return profile && profile.id; });
            if (this.stg.profiles.length > limit)
                this.stg.profiles = this.stg.profiles.slice(0, limit);
            return this.stg.profiles;
        };
        StorageService.prototype.initEmptyProfilesCash = function () {
            this.set({
                profiles: []
            });
            return [];
        };
        StorageService.$inject = [
            '$q',
            '$rootScope',
            'DefaultStorage',
        ];
        return StorageService;
    }());
    StorageApp.StorageService = StorageService;
})(StorageApp || (StorageApp = {}));
//# sourceMappingURL=StorageService.js.map