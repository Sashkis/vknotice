/// <reference path="../../all.d.ts"/>
module BgApp {
	export class BgClass {
		stg = <IStorageData>{};
		badge: number = 0;

		public static $inject = [
			'storage',
			'$vk',
			'deamon',
			'Config',
			'Analytics',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private $vk: VkApp.VkService,
			private deamon: DeamonApp.DeamonService,
			private Config: {profilesLimit: number},
			private Analytics: any
		) {
			storage.ready.then((stg) => {this.StgReady(stg)});
			storage.onChanged((changes) => {this.StgChanged(changes)});
		}

		StgReady(stg: IStorageData) : this {
			this.stg = stg;
			this.cacheProfiles(stg.users, stg.groups);
			stg.profiles && stg.profiles.length && this.storage.clearProfiles( this.Config.profilesLimit );
			stg.counter && this.setBadge();
			// this.initDeamon();
			this.$vk.auth().then(() => {
				this.deamon
					.setConfig({
						method: 'execute.ang',
						params: ()      => this.getDeamonParams(),
						DoneCB: (resp)  => this.deamonDoneCB(resp),
						FailCB: (error) => this.deamonFailCB(error),
					})
					.start();
			});
			return this;
		}

		cacheProfiles(...arraysProfiles: IProfiles[][]) : this {
			arraysProfiles.forEach((profiles) => profiles && profiles.length && this.storage.setProfiles(profiles));
			return this;
		}

		setBadge() : this {
			let newBadge = 0;
			if (!angular.isArray(this.stg.counter)) {
				angular.forEach(this.stg.counter, (counter) => {
					newBadge += angular.isNumber(counter) ? counter : 0;
				});
				this.playSound(newBadge);
			}
			this.badge = newBadge;
			chrome.browserAction.setBadgeText({ text: newBadge > 0 ? `${newBadge}` : '' });
			return this;
		}

		playSound(newBadge: number) : this {
			if (this.stg.options.audio === StorageApp.AudioOptionStatus.Never || newBadge <= this.badge) return this;
			const audio = <HTMLAudioElement>document.getElementById('audio');
			if (this.stg.options.audio === StorageApp.AudioOptionStatus.Always) {
				audio.play();
				return this;
			}
			chrome.tabs.query({url: '*://*.vk.com/*'}, (tabs) => {
				if (!tabs.length) audio.play();
			});
			return this;
		}

		getDeamonParams() {
			const apiOptions = {
				access_token: this.stg.access_token,
				options: '',
				notifyFilters: '',
				notifyLast_viewed: this.stg.notifyLast_viewed,
			};

			if (this.stg.options.friends)       apiOptions.options += 'friends,';
			if (this.stg.options.photos)        apiOptions.options += 'photos,';
			if (this.stg.options.videos)        apiOptions.options += 'videos,';
			if (this.stg.options.messages)      apiOptions.options += 'messages,';
			if (this.stg.options.groups)        apiOptions.options += 'groups,';

			if (this.stg.options.wall)          apiOptions.notifyFilters += 'wall,';
			if (this.stg.options.mentions)      apiOptions.notifyFilters += 'mentions,';
			if (this.stg.options.comments)      apiOptions.notifyFilters += 'comments,';
			if (this.stg.options.likes)         apiOptions.notifyFilters += 'likes,';
			if (this.stg.options.reposts)       apiOptions.notifyFilters += 'reposts,';
			if (this.stg.options.followers)     apiOptions.notifyFilters += 'followers,';

			return apiOptions;
		}

		deamonDoneCB(resp = <any>{}) {
			chrome.browserAction.setIcon({ path: 'img/icon38.png' });
			resp.dialogs && resp.dialogs.map((dialog: any) => {
				dialog.message.attachments && dialog.message.attachments.map((attach: any) => attach.type);
				return dialog;
			});

			delete resp.system;

			this.storage.set(resp);

			return true;
		}

		deamonFailCB(error: string) {
			console.error(error);
			chrome.browserAction.setIcon({ path: 'img/icon38-off.png' });

			return error === 'connect_error';
		}

		StgChanged(changes: any) : this {
			if (changes.users) {
				this.cacheProfiles(changes.users.newValue);
				delete changes.users;
			}

			if (changes.groups) {
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

			const newStg = {};
			angular.forEach(changes, function (change, key) {
				newStg[key] = angular.copy(change.newValue);
			});

			this.storage.set(newStg, false);

			return this;
		}

	}
}

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
