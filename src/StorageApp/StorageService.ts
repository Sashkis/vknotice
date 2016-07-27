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

		getProfileIndex(searchID: number): number {
			if (searchID && this.stg && this.stg.profiles) {
				return this.stg.profiles.findIndex((prof: IProfile) => prof.id === searchID);
			}

			return -1;
		}

		getProfile(id: number) : IProfile | {} {
			const index = this.getProfileIndex(id);
			return index >= 0 ? this.stg.profiles[index] : {};
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

			this.stg.profiles = this.stg.profiles.filter((profile) => profile && profile.id).slice(0, limit);

			return this.stg.profiles;
		}

		initEmptyProfilesCash() : IProfile[] {
			this.set({
				profiles: []
			});
			return [];
		}
	}
}
