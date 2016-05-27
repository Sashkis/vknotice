angular.module('BgApp', ['DeamonApp', 'StorageApp'])

.constant('Config', {
	profilesLimit: 100,
})

.config(['Config', 'storageProvider', 'deamonProvider', function (Config, storageProvider, deamonProvider) {

	function searchIDInArray (array, ID) {
		for (let i = array.length - 1; i >= 0; i--) {
			if (array[i].id == ID) return i;
		}
		return -1;
	}

	function saveProfiles(prof, stg) {
		for (let i = prof.length - 1; i >= 0; i--) {
			let index = searchIDInArray(stg.profiles, prof[i].id);
			if (index > -1) {
				stg.profiles[index] = prof[i];
			} else {
				let length = stg.profiles.unshift(prof[i]);
				if (length > Config.profilesLimit) {
					stg.profiles = stg.profiles.slice(0, Config.profilesLimit);
				}
			}
		}
	}

	storageProvider.set_onLoad_callback(function (stg) {
		if (!stg.profiles) {
			stg.profiles = [];
			if (stg.users) {
				saveProfiles(stg.users, stg);
			}

			if (stg.groups) {
				saveProfiles(stg.groups, stg);
			}
		}

		if (!stg.apiOptions) {
			stg.apiOptions = {
				access_token: stg.access_token,
				counters: 'friends,photos,videos,messages,groups,notifications',
				isLoadComment: 0,
				lastOpenComment: Date.now(),
				lastLoadAlert: 0,
			}
		}
	});

	storageProvider.set_onChanged_callback(function (changes, stg) {
		if (changes.users !== undefined) {
			console.log('onChanged', 'users');
			saveProfiles(changes.users.newValue, stg);
			delete changes.users;
		}

		if (changes.groups !== undefined) {
			console.log('onChanged', 'groups');
			saveProfiles(changes.groups.newValue, stg);
			delete changes.groups;
		}

		if (changes.profiles !== undefined) {
			console.log('onChanged', 'profiles');
			delete changes.profiles;
		}

		if (changes.access_token !== undefined) {
			console.log('onChanged', 'access_token');
			stg.apiOptions.access_token = changes.access_token.newValue;
			console.log(stg.apiOptions);
		}

		angular.forEach(changes, function (change, key) {
			console.log('onChanged', key);
			stg[key] = angular.copy(change.newValue);
		});

		chrome.storage.local.set(stg);
	});


	// deamonProvider.set_isContinue_function
}])

.run(['storage', '$vk', 'deamon', function (storage, $vk, deamon) {
	storage.ready.then(function (stg) {
		$vk.auth().then(function () {
			deamon.start('execute.ang', stg.apiOptions, function (resp) {
				console.log('Main', resp);
				return true;
			});
		}, function (err) {
			console.error('Auth Error', err);
		});
	});
}]);


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

	chrome.contextMenus.create({
		title: 'Открыть в новой вкладке',
		contexts: ['browser_action'],
		onclick: function () {
			window.open('chrome-extension://'+chrome.app.getDetails().id+'/PopupApp/popup.html');
		}
	});
// });
