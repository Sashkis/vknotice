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
			let badge = 0;

			angular.forEach(counters, (counter) => {
				badge += angular.isNumber(counter) ? counter : 0;
			});

			chrome.browserAction.setBadgeText({ text: badge > 0 ? `${badge}` : '' });
			playSound(badge, audioOption);
		}

		function playSound(newBadge, audioOption) {
			if (audioOption === '0') return;
			chrome.browserAction.getBadgeText({}, function (oldBadge) {
				if (newBadge > oldBadge) {
					if (audioOption === '2') document.getElementById('audio').play();
					else {
						chrome.tabs.query({
							url: '*://*.vk.com/*',
						}, function (tabs) {
							if (!tabs.length) document.getElementById('audio').play();
						});
					}
				}
			});
		}

		/**
		 * Отслеживаем изменения в памяти chrome
		 * При изменении определенного параметра выполняем соотведствующие действия
		 */
		storage.onChanged((changes, stg) => {
			if (changes.users && changes.users.newValue) {
				storage.setProfiles(changes.users.newValue);
			}


			if (changes.groups && changes.groups.newValue) {
				storage.setProfiles(changes.groups.newValue);
			}

			// if (changes.profiles !== undefined) {
			// }

			if (changes.counter && changes.counter.newValue) {
				setBadge(changes.counter.newValue, stg.options.audio);
			}

			if (changes.user_id && changes.user_id.newValue) {
				Analytics.set('&uid', changes.user_id.newValue);
			}

			const newStg = {};

			angular.forEach(changes, function (change, key) {
				if (angular.isDefined(change.newValue)) newStg[key] = angular.copy(change.newValue);
			});

			newStg.profiles = stg.profiles;
			storage.set(newStg);
		});

		storage.ready.then(function (stg) {
			// Записать пользователей и групы в кэш профилей
			if (stg.users && stg.users.length) {
				storage.setProfiles(stg.users);
			}

			if (stg.groups && stg.groups.length) {
				storage.setProfiles(stg.groups);
			}

			// Удаляем профили без id
			// и обрезаем если массив профилей превысил лимит
			if (stg.profiles && stg.profiles.length) {
				storage.clearProfiles();
			}

			// Устанавливаем бейдж
			// и воспроизводим звуковое уведомление
			if (stg.counter) {
				setBadge(stg.counter, stg.options.audio);
			}

			// if (angular.isUndefined(stg.lastOpenComment)) {
			// 	stg.lastOpenComment = Date.now();
			// }

			Analytics.trackPage('Background');

			if (stg.user_id) {
				Analytics.set('&uid', stg.user_id);
			}


			$vk.auth().then(function () {
				const apiOptions = {
					access_token: stg.access_token,
					options: '',
					isLoadComment: stg.options.comments,
					lastOpenComment: stg.lastOpenComment,
				};

				if (stg.options.friends)       apiOptions.options += 'friends,';
				if (stg.options.photos)        apiOptions.options += 'photos,';
				if (stg.options.videos)        apiOptions.options += 'videos,';
				if (stg.options.messages)      apiOptions.options += 'messages,';
				if (stg.options.groups)        apiOptions.options += 'groups,';
				if (stg.options.notifications) apiOptions.options += 'notifications,';

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
	if (dialog.message.attachments) delete dialog.message.attachments;

	return dialog;
}

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
