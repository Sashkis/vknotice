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

		getProfile(id: number) : IProfiles | {} {
			const index = this.getProfileIndex(id);
			return (index >= 0 && this.stg.profiles && this.stg.profiles[index]) ? this.stg.profiles[index] : {};
		}

		setProfiles(newProfiles: IProfiles[]) {
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

		clearProfiles(limit: number) : IProfiles[] {
			if (!limit || !this.stg.profiles) return this.initEmptyProfilesCash();

			this.stg.profiles = this.stg.profiles.filter((profile) => profile && profile.id);
			if (this.stg.profiles.length > limit) this.stg.profiles = this.stg.profiles.slice(0, limit);

			return this.stg.profiles;
		}

		initEmptyProfilesCash() : IProfiles[] {
			this.set({
				profiles: []
			});
			return [];
		}
	}

}
