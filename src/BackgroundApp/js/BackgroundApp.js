angular.module('BgApp', ['DeamonApp', 'angular-google-analytics'])

.constant('Config', {
	profilesLimit: 100,
})

.config(['AnalyticsProvider', function (AnalyticsProvider) {
	AnalyticsProvider.setAccount({
		tracker: 'UA-71609511-3',
		fields: {
			cookieName: 'vknotice-analitics',
			cookieDomain: 'none',
		},
		set: {
			forceSSL: true,
		},
	})
	.setHybridMobileSupport(true);
	AnalyticsProvider.logAllCalls(true);
}])

.run(['Config', 'storage', '$vk', 'deamon', '$log', 'Analytics',
	function (Config, storage, $vk, deamon, $log, Analytics) {
		let currentBadge = 0;

		function setBadge(counters) {
			let badge = 0;

			angular.forEach(counters, (counter) => {
				badge += angular.isNumber(counter) ? counter : 0;
			});

			chrome.browserAction.setBadgeText({ text: badge > 0 ? `${badge}` : '' });

			return badge;
		}

		function playSound(newBadge, stg) {
			if (stg.audio && newBadge > currentBadge) {
				chrome.tabs.query({
					url: '*://*.vk.com/*',
				}, function (tabs) {
					if (!tabs.length) document.getElementById('audio').play();
				});
			}
		}

		storage.set_onLoad_callback(function (stg) {
			// Записать пользователей и групы в кэш профилей
			if (stg.users) {
				storage.setProfiles(stg.users);
			}

			if (stg.groups) {
				storage.setProfiles(stg.groups);
			}

			// Удаляем профили без id
			// и обрезаем если массив профилей превысил лимит
			{
				let filteredProfiles = [];

				angular.forEach(stg.profiles, function (profile) {
					if (profile && profile.id) filteredProfiles.push(profile);
				});

				if (filteredProfiles.length > Config.profilesLimit) {
					filteredProfiles = filteredProfiles.slice(0, Config.profilesLimit);
				}
				stg.profiles = angular.copy(filteredProfiles);
			}

			// Устанавливаем бейдж
			// и воспроизводим звуковое уведомление
			if (stg.counter) {
				let badge = setBadge(stg.counter);

				playSound(badge, stg);
				currentBadge = badge;
			}

			// Если свойство с настройками для API не задано
			// задаем его с параметрами по умолчанию
			if (!stg.apiOptions) {
				stg.apiOptions = {
					access_token: stg.access_token,
					options: 'friends,photos,videos,messages,groups,notifications',
					isLoadComment: 0,
					lastOpenComment: Date.now(),
					lastLoadAlert: 0,
				};
			}

			if (angular.isUndefined(stg.audio)) {
				stg.audio = 1;
			}
		});

		storage.set_onChanged_callback(function (changes, stg) {
			if (angular.isDefined(changes.users)) {
				storage.setProfiles(changes.users.newValue);
			}

			if (angular.isDefined(changes.groups)) {
				storage.setProfiles(changes.groups.newValue);
			}

			// if (changes.profiles !== undefined) {
			// }

			if (angular.isDefined(changes.access_token)) {
				stg.apiOptions.access_token = changes.access_token.newValue;
			}

			if (angular.isDefined(changes.counter)) {
				let badge = setBadge(changes.counter.newValue);

				playSound(badge, stg);
				currentBadge = badge;
			}

			angular.forEach(changes, function (change, key) {
				stg[key] = angular.copy(change.newValue);
			});

			chrome.storage.local.set(stg);
		});

		storage.ready.then(function (stg) {
			Analytics.trackPage('Background');
			Analytics.set('&uid', stg.user_id);
			$vk.auth().then(function () {
				deamon.start('execute.ang', stg.apiOptions, function (resp) {
					chrome.browserAction.setIcon({ path: 'img/icon38.png' });
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


// "use strict";
// jQuery(function ($) {

	// Informer.deamonStart();
// 	Informer.firstRequest.done(vk => {
// 		const app = new App();

// 		vk.api('stats.trackVisitor');

// 		app.load({ 'subscribeMessage': 0 }).done(stg => {
// 			if (stg.subscribeMessage < $.now() - 2628002880) {
// 				vk.api('groups.isMember', { group_id: app.group_id }).done(isMember => {
// 					if (!isMember) {
// 						Informer.saveAlert({
// 							'header': 'Try for you',
// 							'footer': 'Close',
// 							'body': {
// 								'img'	 : 'https://vk.com/images/stickers/1909/128.png',
// 								'text'	 : 'Help us to become better',
// 								'ancor'	 : 'Participate to the polls in our group',
// 								'url'	 : 'https://vk.com/vknotice',
// 							},
// 						});
// 						chrome.storage.local.set({ 'subscribeMessage': $.now() });
// 					}
// 				});
// 			}
// 		});

// 	});

// 	function commentUpdate (tab) {
// 		if (tab.status === 'complete' && /vk.com\/feed\?section=comments/.test(tab.url)) {
// 			chrome.storage.local.set({
// 				'lastOpenComment': parseInt(new Date().getTime()/1000)
// 			});
// 		}
// 	}

// 	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 		if (changeInfo.status === 'complete') {
// 			commentUpdate(tab);
// 		}
// 	});

// 	chrome.tabs.onActivated.addListener(activeInfo => {
// 		chrome.tabs.get(activeInfo.tabId, commentUpdate);
// 	});

// 	chrome.runtime.onInstalled.addListener(details => {
// 		// При установке
// 		if (details.reason === 'install') {
// 			chrome.alarms.create('say_thanks', { 'when': $.now() + 86400000 * 7 });	// Через 7 дней
// 			chrome.alarms.create('get_review', { 'when': $.now() + 3600000 });		// Через 1 час
// 			chrome.storage.local.set({
// 				'lastOpenComment': parseInt($.now()/1000)
// 			});
// 		}
// 	});

// 	chrome.alarms.onAlarm.addListener(alarm => {
// 		const app = new App();
// 		if (alarm.name === 'get_review') {
// 			Informer.saveAlert({
// 				'header': 'Try for you',
// 				'footer': 'Close',
// 				'body': {
// 					'img'	 : 'https://vk.com/images/stickers/644/128.png',
// 					'text'	 : 'Help us to become better',
// 					'ancor'	 : 'Leave a review',
// 					'url'	 : app.comment
// 				}
// 			});
// 		} else if (alarm.name === 'say_thanks') {
// 			Informer.saveAlert({
// 				'header': 'Try for you',
// 				'footer': 'Close',
// 				'body': {
// 					'img'	 : 'https://vk.com/images/stickers/630/128.png',
// 					'ancor'	 : 'To thank the author',
// 					'url'	 : app.share,
// 				}
// 			});
// 		}
// 	});


// });
