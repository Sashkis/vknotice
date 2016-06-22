angular.module('BgApp', ['DeamonApp', 'angular-google-analytics'])
    .constant('Config', {
    profilesLimit: 100,
})
    .config(['$provide', 'AnalyticsProvider', function ($provide, AnalyticsProvider) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$log', function ($delegate, $log) {
                return function (exception, cause) {
                    $log.warn(exception, cause);
                    $delegate(exception, cause);
                };
            }]);
        AnalyticsProvider.setAccount({
            tracker: 'UA-71609511-3',
            trackEvent: true,
            fields: {
                cookieName: 'vknotice-analitics',
                cookieDomain: 'none',
            },
            set: {
                forceSSL: true,
            },
        })
            .setHybridMobileSupport(true);
    }])
    .run(['Config', 'storage', '$vk', 'deamon', '$log', 'Analytics',
    function (Config, storage, $vk, deamon, $log, Analytics) {
        function setBadge(counters, audioOption) {
            var badge = 0;
            angular.forEach(counters, function (counter) {
                badge += angular.isNumber(counter) ? counter : 0;
            });
            chrome.browserAction.setBadgeText({ text: badge > 0 ? "" + badge : '' });
            playSound(badge, audioOption);
        }
        function playSound(newBadge, audioOption) {
            if (audioOption === '0')
                return;
            chrome.browserAction.getBadgeText({}, function (oldBadge) {
                if (newBadge > oldBadge) {
                    if (audioOption === '2')
                        document.getElementById('audio').play();
                    else {
                        chrome.tabs.query({
                            url: '*://*.vk.com/*',
                        }, function (tabs) {
                            if (!tabs.length)
                                document.getElementById('audio').play();
                        });
                    }
                }
            });
        }
        storage.onChanged(function (changes, stg) {
            if (changes.users && changes.users.newValue) {
                storage.setProfiles(changes.users.newValue);
            }
            if (changes.groups && changes.groups.newValue) {
                storage.setProfiles(changes.groups.newValue);
            }
            if (changes.counter && changes.counter.newValue) {
                setBadge(changes.counter.newValue, stg.options.audio);
            }
            if (changes.user_id && changes.user_id.newValue) {
                Analytics.set('&uid', changes.user_id.newValue);
            }
            var newStg = {};
            angular.forEach(changes, function (change, key) {
                if (angular.isDefined(change.newValue))
                    newStg[key] = angular.copy(change.newValue);
            });
            newStg.profiles = stg.profiles;
            storage.set(newStg);
        });
        storage.ready.then(function (stg) {
            if (angular.isUndefined(stg.profiles)) {
                storage.set({
                    profiles: [],
                });
            }
            if (angular.isUndefined(stg.options)) {
                storage.set({
                    options: {
                        friends: true,
                        photos: true,
                        videos: true,
                        messages: true,
                        groups: true,
                        notifications: true,
                        comments: true,
                        audio: '1',
                    },
                });
            }
            if (stg.users) {
                storage.setProfiles(stg.users);
            }
            if (stg.groups) {
                storage.setProfiles(stg.groups);
            }
            storage.clearProfiles();
            if (stg.counter) {
                setBadge(stg.counter, stg.options.audio);
            }
            if (angular.isUndefined(stg.lastOpenComment)) {
                stg.lastOpenComment = Date.now();
            }
            Analytics.trackPage('Background');
            if (stg.user_id) {
                Analytics.set('&uid', stg.user_id);
            }
            $vk.auth().then(function () {
                var apiOptions = {
                    access_token: stg.access_token,
                    options: '',
                    isLoadComment: stg.options.comments,
                    lastOpenComment: stg.lastOpenComment,
                };
                if (stg.options.friends)
                    apiOptions.options += 'friends,';
                if (stg.options.photos)
                    apiOptions.options += 'photos,';
                if (stg.options.videos)
                    apiOptions.options += 'videos,';
                if (stg.options.messages)
                    apiOptions.options += 'messages,';
                if (stg.options.groups)
                    apiOptions.options += 'groups,';
                if (stg.options.notifications)
                    apiOptions.options += 'notifications,';
                deamon.start('execute.ang', apiOptions, function (resp) {
                    chrome.browserAction.setIcon({ path: 'img/icon38.png' });
                    resp.dialogs.map(deleteAttachent);
                    delete resp.system;
                    storage.set(resp);
                    return true;
                }, function (error) {
                    chrome.browserAction.setIcon({ path: 'img/icon38-off.png' });
                    return error === 'connect_error';
                });
            }, function (error) {
                $log.error('Auth Error', error);
            });
        });
    },
]);
function deleteAttachent(dialog) {
    if (dialog.message.attachments)
        delete dialog.message.attachments;
    return dialog;
}
//# sourceMappingURL=BackgroundApp.js.map