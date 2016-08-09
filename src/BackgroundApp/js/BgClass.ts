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
			'gettextCatalog',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private $vk: VkApp.VkService,
			private deamon: DeamonApp.DeamonService,
			private Config: {profilesLimit: number},
			private Analytics: any,
			private gettextCatalog: any
		) {
			storage.ready.then((stg) => this.StgReady(stg));
			storage.onChanged((changes) => this.StgChanged(changes));
			chrome.browserAction.setBadgeBackgroundColor({color: '#ff4136'});
			chrome.runtime.onInstalled.addListener((details) => this.onInstalled(details));
			chrome.alarms.onAlarm.addListener((alarm) => this.onAlarm(alarm));
		}

		StgReady(stg: IStorageData) : this {
			this.stg = stg;

			if (stg.groups) stg.groups = stg.groups.map(this.setNegativeID);
			this.cacheProfiles(stg.users, stg.groups);

			if (stg.profiles && stg.profiles.length) this.storage.clearProfiles( this.Config.profilesLimit );

			if (stg.counter) this.setBadge();

			this.$vk.auth().then(() => {
				this.deamon
					.setConfig({
						method: 'execute.get',
						params: ()      => this.getDeamonParams(),
						DoneCB: (resp)  => this.deamonDoneCB(resp),
						FailCB: (error) => this.deamonFailCB(error),
					})
					.start();
			});
			return this;
		}

		cacheProfiles(...arraysProfiles: IProfile[][]) : this {
			arraysProfiles.forEach((profiles) => profiles && profiles.length && this.storage.setProfiles(profiles));
			return this;
		}

		setNegativeID(profile: IProfile) {
			profile.id = -profile.id;
			return profile;
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
				func_v: 2,
			};

			if (this.stg.options.friends)   apiOptions.options += 'friends,';
			if (this.stg.options.photos)    apiOptions.options += 'photos,';
			if (this.stg.options.videos)    apiOptions.options += 'videos,';
			if (this.stg.options.messages)  apiOptions.options += 'messages,';
			if (this.stg.options.groups)    apiOptions.options += 'groups,';

			if (this.stg.options.wall)      apiOptions.notifyFilters += 'wall,';
			if (this.stg.options.mentions)  apiOptions.notifyFilters += 'mentions,';
			if (this.stg.options.comments)  apiOptions.notifyFilters += 'comments,';
			if (this.stg.options.likes)     apiOptions.notifyFilters += 'likes,';
			if (this.stg.options.reposts)   apiOptions.notifyFilters += 'reposts,';
			if (this.stg.options.followers) apiOptions.notifyFilters += 'followers,';

			return apiOptions;
		}

		deamonDoneCB(resp = <any>{}) {
			chrome.browserAction.setIcon({ path: 'img/icon38.png' });

			if (angular.isArray(resp.dialogs)) {
				resp.dialogs = resp.dialogs.map((dialog: IVkDialog) => {
					return new SectionsApp.Dialog(dialog);
				});
			}

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

			const newStg = {};
			angular.forEach(changes, (change, key) =>	newStg[key] = angular.copy(change.newValue));

			this.storage.set(newStg, false);

			return this;
		}

		pushAlert(alert: IAlert) {
			this.stg.alerts.push(alert);
			this.storage.set({
				alerts: this.stg.alerts
			});
		}

		onInstalled(details: chrome.runtime.InstalledDetails) {
			if (details.reason === 'install') {
				chrome.alarms.create('get-review', { delayInMinutes: 60*24*5 });
				chrome.alarms.create('say-thanks', { delayInMinutes: 60*24*10 });
				chrome.alarms.create('donate', { delayInMinutes: 60*24*30 });
			} else if (details.reason === 'update' && details.previousVersion) {

				let [major, minor, patch] = details.previousVersion.split('.').map(n => +n);
				const previos = {major, minor, patch};

				const version = chrome.runtime.getManifest().version;
				[major, minor, patch] = version.split('.').map(n => +n);
				const current = {major, minor, patch};

				if (current.major > previos.major || current.minor > previos.minor) {
					chrome.alarms.create('get-new-review', { delayInMinutes: 60*24*15 });
					this.pushAlert({
						id: 'update-alert',
						type: 'simple',
						img: 'https://vk.com/images/stickers/2077/128.png',
						text: this.gettextCatalog.getString('Информер обновлен до версии {{version}}', {version}),
						ancor: this.gettextCatalog.getString('Смотрите подробности в нашей группе'),
						url: 'https://vk.com/club90041499',
					});
				}

				// Удалить данные при обновлении на версию 5.1.*
				if (previos.major < 5 || (previos.major === 5 && previos.minor < 1) ) {
					this.storage.clear(() => chrome.runtime.reload());
				}
			}
		}

		onAlarm(alarm: chrome.alarms.Alarm) {
			let alert: IAlert | undefined;
			switch (alarm.name) {
				case 'get-review':
					alert = {
						'id':    alarm.name,
						'type':  'simple',
						'img':   'https://vk.com/images/stickers/2073/128.png',
						'text':  this.gettextCatalog.getString('Помогите нам стать лучше'),
						'ancor': this.gettextCatalog.getString('Оставьте свой отзыв'),
						'url':   Helpers.getReviewUrl(),
					};
				break;
				case 'get-new-review':
					alert = {
						'id':    alarm.name,
						'type':  'simple',
						'img':   'https://vk.com/images/stickers/2073/128.png',
						'text':  this.gettextCatalog.getString('Помогите нам стать лучше'),
						'ancor': this.gettextCatalog.getString('Оставьте отзыв о новой версии'),
						'url':   Helpers.getReviewUrl(),
					};
				break;
				case 'say-thanks':
					alert = {
						'id':    alarm.name,
						'type':  'simple',
						'img':   'https://vk.com/images/stickers/2074/128.png',
						'text':  this.gettextCatalog.getString('Мы работаем для вас'),
						'ancor': this.gettextCatalog.getString('Скажите авторам «Спасибо»'),
						'url':   Helpers.getShareUrl(),
					};
				break;
				case 'donate':
					alert = {
						'id':    alarm.name,
						'type':  'simple',
						'img':   'https://new.vk.com/images/stickers/2080/128.png',
						'text':  this.gettextCatalog.getString('Вам нравится Информер?'),
						'ancor': this.gettextCatalog.getString('Помогите ему и дальше развиваться для вас'),
						'url':   'https://www.liqpay.com/ru/checkout/card/vknotify',
					};
				break;
			}

			if (alert) {
				this.pushAlert(alert);
			}
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
