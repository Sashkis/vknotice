/// <reference path="../all.d.ts"/>
module StorageApp {

	export enum AudioOptionStatus {
		Never,
		SomeConditions,
		Always,
	}

	export class StorageService {
		ready: ng.IPromise<IStorageData>;
		stg = <IStorageData>{};

		public static $inject = [
			'$q',
			'$rootScope',
			'DefaultStorage',
		];

		constructor($q: ng.IQService, private $rootScope: ng.IRootScopeService, DefaultStorage: IStorageData) {
			const Promise = $q.defer<IStorageData>();

			this.ready = Promise.promise;

			chrome.storage.local.get(DefaultStorage, (stg: IStorageData) => {
				this.stg = angular.copy(stg);

				$rootScope.$apply();
				Promise.resolve(this.stg);
			});
		}

		onChanged(callback = (changes: chrome.storage.StorageChange, stg: IStorageData) => {}) {
			chrome.storage.onChanged.addListener((changes) => {
				callback(changes, this.stg);
				this.$rootScope.$apply();
			});
		}

		set(data: {}, needSaveInCrrome = true, callback = () => {}) {
			angular.extend(this.stg, angular.copy(data));
			needSaveInCrrome && chrome.storage.local.set(data, callback);
		}

		clear(callback?: () => void) {
			chrome.storage.local.clear(callback);
		}

		getProfileIndex(id: number): number {
			if (id && this.stg
			       && this.stg.profiles
			) {
				for (let i = 0; i < this.stg.profiles.length; i++) {
					if (this.stg.profiles[i].id === id) return i;
				}
			}

			return -1;
		}

		getProfile(id: number) : IProfile | {} {
			const index = this.getProfileIndex(id);
			return (index >= 0 && this.stg.profiles && this.stg.profiles[index]) ? this.stg.profiles[index] : {};
		}

		setProfiles(newProfiles: IProfile[]) {
			if (!this.stg.profiles) this.initEmptyProfilesCash();

			const needSearch = this.stg.profiles.length > 0;
			if (!angular.isArray(newProfiles)) return this.stg.profiles;

			newProfiles.map((profile) => {
				if (!profile || !profile.id) return;
				const index = needSearch ? this.getProfileIndex(profile.id) : -1;

				if (index >= 0) {
					this.stg.profiles[index] = profile;
				} else {
					this.stg.profiles.unshift(profile);
				}
			});

			this.set({profiles: this.stg.profiles});
			return this.stg.profiles;
		}

		clearProfiles(limit: number) : IProfile[] {
			if (!limit || !this.stg.profiles) return this.initEmptyProfilesCash();

			this.stg.profiles = this.stg.profiles.filter((profile) => profile && profile.id);
			if (this.stg.profiles.length > limit) this.stg.profiles = this.stg.profiles.slice(0, limit);

			return this.stg.profiles;
		}

		initEmptyProfilesCash() : IProfile[] {
			this.set({
				profiles: []
			});
			return [];
		}

		getDialogID(dialog: IDialog) {
			if (dialog.message.chat_id) return 2000000000 + dialog.message.chat_id;
			return dialog.message.user_id;
		}

		getDialogIndex(id: number): number {
			if (id && this.stg
						 && this.stg.dialogs_cache
			) {
				for (let i = 0; i < this.stg.dialogs_cache.length; i++) {
					if (this.stg.dialogs_cache[i].id === id) return i;
				}
			}

			return -1;
		}

		getDialog(id: number) {
			const index = this.getDialogIndex(id);
			return index >= 0 ? this.stg.dialogs_cache[index] : undefined;
		}

		getCachedDialog(dialog: IDialog) {
			const dialogID = this.getDialogID(dialog);
			const targetDialogIndex = this.getDialogIndex(dialogID);

			if (targetDialogIndex >= 0) {
				const targetDialog = this.stg.dialogs_cache[ targetDialogIndex ];

				if (!angular.isArray(targetDialog.message)) targetDialog.message = [];

				const lastMessIndex = targetDialog.message.length-1;
				if (dialog.message.id === targetDialog.message[ lastMessIndex ].id) {
					targetDialog.message[ lastMessIndex ] = dialog.message;
				} else {
					targetDialog.message.push( dialog.message );
				}

				return targetDialog;
			} else {
				return <IDialog_cached>{
					id:       dialogID,
					message:  [dialog.message],
					in_read:  dialog.in_read,
					out_read: dialog.out_read,
					unread: dialog.unread,
				};
			}

		}

		cacheDialogs(dialogs: IDialog[]) {
			const cache = dialogs.map((dialog) => this.getCachedDialog(dialog));
			this.set({dialogs_cache: cache});
		}
	}

}
