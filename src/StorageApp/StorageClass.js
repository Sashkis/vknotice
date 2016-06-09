// eslint-disable-next-line no-unused-vars
class Storage {
	constructor($q, $rootScope) {
		const Promise = new $q.defer();

		this.$rootScope = $rootScope;
		this.ready = Promise.promise;
		this.stg = {};

		chrome.storage.local.get((stg) => {
			this.stg = angular.copy(stg);

			$rootScope.$apply();
			Promise.resolve(this.stg);
		});
	}

	onChanged(callback) {
		chrome.storage.onChanged.addListener((changes) => {
			callback(changes, this.stg);
			this.$rootScope.$apply();
		});
	}

	set(data, callback) {
		chrome.storage.local.set(data, callback);
	}

	getProfileIndex(id) {
		if (!id
			|| angular.isUndefined(this.stg)
			|| angular.isUndefined(this.stg.profiles)
			|| !angular.isArray(this.stg.profiles)
		) return -1;
		for (let i = 0; i < this.stg.profiles.length; i++) {
			// Нельзя проводить сравнение по типу,
			// так как id может быть передан в качестве строки
			if (this.stg.profiles[i].id == id) return i;
		}

		return -1;
	}

	getProfile(id) {
		const index = this.getProfileIndex(id);

		return index >= 0 ? this.stg.profiles[index] : {};
	}

	setProfiles(array) {
		array.map((profile) => {
			const index = this.getProfileIndex(profile.id);

			if (angular.isUndefined(this.stg.profiles)) this.stg.profiles = [];

			if (index >= 0) {
				this.stg.profiles[index] = profile;
			} else {
				this.stg.profiles.unshift(profile);
			}
		});
	}

	clearProfiles(limit) {
		if (limit === 0) return this.stg.profiles = [];

		this.stg.profiles = this.stg.profiles.filter((profile) => profile && profile.id);
		if (this.stg.profiles.length > limit) return this.stg.profiles = this.stg.profiles.slice(0, limit);

		return this.stg.profiles;
	}
}
