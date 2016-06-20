/// <reference path="../all.d.ts"/>
module StorageApp {

	export class StorageService {
		$rootScope: ng.IRootScopeService;
		ready: ng.IPromise<{}>;
		stg: IStorageData;

		constructor($q: ng.IQService, $rootScope: ng.IRootScopeService) {
			const Promise = $q.defer();

			this.$rootScope = $rootScope;
			this.ready = Promise.promise;
			// this.stg = {};

			chrome.storage.local.get((stg) => {
				this.stg = angular.copy(stg);

				$rootScope.$apply();
				Promise.resolve(this.stg);
			});
		}

		onChanged(callback: Function) {
			chrome.storage.onChanged.addListener((changes) => {
				callback(changes, this.stg);
				this.$rootScope.$apply();
			});
		}

		set(data: IStorageData, callback:() => void = () => {}) {
			angular.extend(this.stg, angular.copy(data) );
			chrome.storage.local.set(data, callback);
		}

		getProfileIndex(id: number | string): number {
			if (id && this.stg
			       && this.stg.profiles
			) {
				for (let i = 0; i < this.stg.profiles.length; i++) {
					// Нельзя проводить сравнение по типу,
					// так как id может быть передан в качестве строки
					if (this.stg.profiles[i].id == id) return i;
				}
			}

			return -1;
		}

		getProfile(id: number) : IProfiles | Object {
			const index = this.getProfileIndex(id);

			return (index >= 0 && this.stg.profiles && this.stg.profiles[index]) ? this.stg.profiles[index] : {};
		}

		setProfiles(array: IProfiles[]) {
			if (!angular.isArray(array)) return;
			array.map((profile) => {
				if (!profile || !profile.id) return;
				const index = this.getProfileIndex(profile.id);

				if (!this.stg.profiles) this.stg.profiles = [];

				if (index >= 0) {
					this.stg.profiles[index] = profile;
				} else {
					this.stg.profiles.unshift(profile);
				}
			});
		}

		clearProfiles(limit: number) : IProfiles[] {
			if (limit === 0 || !this.stg.profiles) return this.stg.profiles = [];

			this.stg.profiles = this.stg.profiles.filter((profile) => profile && profile.id);
			if (this.stg.profiles.length > limit) return this.stg.profiles = this.stg.profiles.slice(0, limit);

			return this.stg.profiles;
		}
	}

}
