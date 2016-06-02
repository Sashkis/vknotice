angular.module('StorageApp', [])
	.factory('storage', ['$q', '$rootScope', function ($q, $rootScope) {
		let onLoad = function () {};
		let onChanged = function () {};
		const ready = $q.defer();
		const storage = {
			set_onChanged_callback: function (cb) {
				onChanged = cb;
			},

			set_onLoad_callback: function (cb) {
				onLoad = cb;
			},
			ready: ready.promise,
			stg: {},
			set: function (data, cb) {
				chrome.storage.local.set(data, cb);
			},
			getProfileIndex: function (id) {
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
			},
			getProfile: function (id) {
				const index = this.getProfileIndex(id);

				return index >= 0 ? this.stg.profiles[index] : {};
			},
			setProfiles: function (array) {
				array.map((profile) => {
					const index = this.getProfileIndex(profile.id);

					if (angular.isUndefined(this.stg.profiles)) this.stg.profiles = [];

					if (index >= 0) {
						this.stg.profiles[index] = profile;
					} else {
						this.stg.profiles.unshift(profile);
					}
				});
			},
		};

		chrome.storage.local.get(function (stg) {
			storage.stg = angular.copy(stg);

			onLoad(storage.stg);

			$rootScope.$apply();
			ready.resolve(storage.stg);

			chrome.storage.onChanged.addListener(function (changes) {
				onChanged(changes, storage.stg);
				$rootScope.$apply();
			});
		});

		return storage;

	}]);
