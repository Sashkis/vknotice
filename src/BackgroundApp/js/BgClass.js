var BgApp;
(function (BgApp) {
    var BgClass = (function () {
        function BgClass(storage, $vk, deamon, Config, Analytics, gettextCatalog) {
            var _this = this;
            this.storage = storage;
            this.$vk = $vk;
            this.deamon = deamon;
            this.Config = Config;
            this.Analytics = Analytics;
            this.gettextCatalog = gettextCatalog;
            this.stg = {};
            this.badge = 0;
            storage.ready.then(function (stg) { return _this.StgReady(stg); });
            storage.onChanged(function (changes) { return _this.StgChanged(changes); });
            chrome.runtime.onInstalled.addListener(function (details) { return _this.onInstalled(details); });
            chrome.alarms.onAlarm.addListener(function (alarm) { return _this.onAlarm(alarm); });
        }
        BgClass.prototype.StgReady = function (stg) {
            var _this = this;
            this.stg = stg;
            if (stg.groups)
                stg.groups = stg.groups.map(this.setNegativeID);
            this.cacheProfiles(stg.users, stg.groups);
            if (stg.profiles && stg.profiles.length)
                this.storage.clearProfiles(this.Config.profilesLimit);
            if (stg.counter)
                this.setBadge();
            this.$vk.auth().then(function () {
                _this.deamon
                    .setConfig({
                    method: 'execute.get',
                    params: function () { return _this.getDeamonParams(); },
                    DoneCB: function (resp) { return _this.deamonDoneCB(resp); },
                    FailCB: function (error) { return _this.deamonFailCB(error); },
                })
                    .start();
            });
            return this;
        };
        BgClass.prototype.cacheProfiles = function () {
            var _this = this;
            var arraysProfiles = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arraysProfiles[_i - 0] = arguments[_i];
            }
            arraysProfiles.forEach(function (profiles) { return profiles && profiles.length && _this.storage.setProfiles(profiles); });
            return this;
        };
        BgClass.prototype.setNegativeID = function (profile) {
            profile.id = -profile.id;
            return profile;
        };
        BgClass.prototype.setBadge = function () {
            var newBadge = 0;
            if (!angular.isArray(this.stg.counter)) {
                angular.forEach(this.stg.counter, function (counter) {
                    newBadge += angular.isNumber(counter) ? counter : 0;
                });
                this.playSound(newBadge);
            }
            this.badge = newBadge;
            chrome.browserAction.setBadgeText({ text: newBadge > 0 ? "" + newBadge : '' });
            return this;
        };
        BgClass.prototype.playSound = function (newBadge) {
            if (this.stg.options.audio === StorageApp.AudioOptionStatus.Never || newBadge <= this.badge)
                return this;
            var audio = document.getElementById('audio');
            if (this.stg.options.audio === StorageApp.AudioOptionStatus.Always) {
                audio.play();
                return this;
            }
            chrome.tabs.query({ url: '*://*.vk.com/*' }, function (tabs) {
                if (!tabs.length)
                    audio.play();
            });
            return this;
        };
        BgClass.prototype.getDeamonParams = function () {
            var apiOptions = {
                access_token: this.stg.access_token,
                options: '',
                notifyFilters: '',
                notifyLast_viewed: this.stg.notifyLast_viewed,
                func_v: 2,
            };
            if (this.stg.options.friends)
                apiOptions.options += 'friends,';
            if (this.stg.options.photos)
                apiOptions.options += 'photos,';
            if (this.stg.options.videos)
                apiOptions.options += 'videos,';
            if (this.stg.options.messages)
                apiOptions.options += 'messages,';
            if (this.stg.options.groups)
                apiOptions.options += 'groups,';
            if (this.stg.options.wall)
                apiOptions.notifyFilters += 'wall,';
            if (this.stg.options.mentions)
                apiOptions.notifyFilters += 'mentions,';
            if (this.stg.options.comments)
                apiOptions.notifyFilters += 'comments,';
            if (this.stg.options.likes)
                apiOptions.notifyFilters += 'likes,';
            if (this.stg.options.reposts)
                apiOptions.notifyFilters += 'reposts,';
            if (this.stg.options.followers)
                apiOptions.notifyFilters += 'followers,';
            return apiOptions;
        };
        BgClass.prototype.deamonDoneCB = function (resp) {
            if (resp === void 0) { resp = {}; }
            chrome.browserAction.setIcon({ path: 'img/icon38.png' });
            if (angular.isArray(resp.dialogs)) {
                resp.dialogs = resp.dialogs.map(function (dialog) {
                    return new SectionsApp.Dialog(dialog);
                });
            }
            delete resp.system;
            this.storage.set(resp);
            return true;
        };
        BgClass.prototype.deamonFailCB = function (error) {
            console.error(error);
            chrome.browserAction.setIcon({ path: 'img/icon38-off.png' });
            return error === 'connect_error';
        };
        BgClass.prototype.StgChanged = function (changes) {
            if (changes.users) {
                this.cacheProfiles(changes.users.newValue);
                delete changes.users;
            }
            if (changes.groups) {
                if (angular.isArray(changes.groups.newValue))
                    changes.groups.newValue = changes.groups.newValue.map(this.setNegativeID);
                this.cacheProfiles(changes.groups.newValue);
                delete changes.groups;
            }
            if (changes.counter && changes.counter.newValue) {
                this.stg.counter = angular.copy(changes.counter.newValue);
                this.setBadge();
                delete changes.counter;
            }
            if (changes.access_token) {
                this.stg.access_token = changes.access_token.newValue;
                delete changes.access_token;
            }
            if (changes.user_id && changes.user_id.newValue) {
                this.Analytics.set('&uid', changes.user_id.newValue);
                this.stg.user_id = changes.user_id.newValue;
                delete changes.user_id;
            }
            var newStg = {};
            angular.forEach(changes, function (change, key) { return newStg[key] = angular.copy(change.newValue); });
            this.storage.set(newStg, false);
            return this;
        };
        BgClass.prototype.pushAlert = function (alert) {
            this.stg.alerts.push(alert);
            this.storage.set({
                alerts: this.stg.alerts
            });
        };
        BgClass.prototype.onInstalled = function (details) {
            if (details.reason === 'install') {
                chrome.alarms.create('get-review', { delayInMinutes: 60 * 24 * 5 });
                chrome.alarms.create('say-thanks', { delayInMinutes: 60 * 24 * 10 });
            }
            else if (details.reason === 'update' && details.previousVersion) {
                var _a = details.previousVersion.split('.'), major = _a[0], minor = _a[1], patch = _a[2];
                var previos = { major: major, minor: minor, patch: patch };
                var version = chrome.runtime.getManifest().version;
                _b = version.split('.'), major = _b[0], minor = _b[1], patch = _b[2];
                var current = { major: major, minor: minor, patch: patch };
                if (+current.major > +previos.major || +current.minor > +previos.minor) {
                    this.pushAlert({
                        id: 'update-alert',
                        type: 'simple',
                        img: 'https://vk.com/images/stickers/2077/128.png',
                        text: this.gettextCatalog.getString('Информер обновлен до версии {{version}}', { version: version }),
                        ancor: this.gettextCatalog.getString('Смотрите подробности в нашей группе'),
                        url: 'https://vk.com/club90041499',
                    });
                }
            }
            var _b;
        };
        BgClass.prototype.onAlarm = function (alarm) {
            var alert;
            switch (alarm.name) {
                case 'get-review':
                    alert = {
                        'id': 'get-review',
                        'type': 'simple',
                        'img': 'https://vk.com/images/stickers/2073/128.png',
                        'text': this.gettextCatalog.getString('Помогите нам стать лучше'),
                        'ancor': this.gettextCatalog.getString('Оставьте свой отзыв'),
                        'url': Helpers.getReviewUrl(),
                    };
                    break;
                case 'say-thanks':
                    alert = {
                        'id': 'say-thanks',
                        'type': 'simple',
                        'img': 'https://vk.com/images/stickers/2074/128.png',
                        'text': this.gettextCatalog.getString('Мы старались для вас'),
                        'ancor': this.gettextCatalog.getString('Скажите авторам «Спасибо»'),
                        'url': Helpers.getShareUrl(),
                    };
                    break;
            }
            if (alert) {
                this.pushAlert(alert);
            }
        };
        BgClass.$inject = [
            'storage',
            '$vk',
            'deamon',
            'Config',
            'Analytics',
            'gettextCatalog',
        ];
        return BgClass;
    }());
    BgApp.BgClass = BgClass;
})(BgApp || (BgApp = {}));
//# sourceMappingURL=BgClass.js.map