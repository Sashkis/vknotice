angular.module('StorageApp', [])

	.factory('filter', [function () {
		function auto_filter (val, key) {
			if (this[key] !== undefined) return this[key](val);
			else return default_filter(val);
		}

		function index_users_filter(users, target) {
			const indexed_list = angular.isArray(target) ? {} : angular.isObject(target) ? target : {};
			angular.forEach(users, function (user) {
				indexed_list[user.id] = user;
			});
			return indexed_list;
		}

		function replace_id_to_user_filter (array_ids, profiles) {
			return array_ids.map((user_id) => {
				return profiles[user_id] || {};
			});
		}

		function default_filter (val) {
			return val;
		}

		return {
			auto: auto_filter,
			profiles: index_users_filter,
			friends: replace_id_to_user_filter
		}

	}])

	.service('storage', ['$q','$rootScope','filter', function ($q,$rootScope,filter) {
		let $this = this;
		let defer = $q.defer();
		$this.defer = defer.promise;

		chrome.storage.local.get(function (stg) {
			$this.stg = angular.extend({}, stg);

			$this.stg.profiles = filter.profiles(stg.users, $this.stg.profiles);
			$this.stg.profiles = filter.profiles(stg.groups, $this.stg.profiles);
			$this.stg.friends = filter.friends(stg.friends, $this.stg.profiles);

			delete $this.stg.users;
			delete $this.stg.groups;

			$rootScope.$apply();
			defer.resolve($this.stg)

			chrome.storage.onChanged.addListener(function (changes) {
				if (changes.users !== undefined) {
					$this.stg.profiles = filter.profiles(changes.users.newValue, $this.stg.profiles);
					delete changes.users;
				}
				if (changes.groups !== undefined) {
					$this.stg.profiles = filter.profiles(changes.groups.newValue, $this.stg.profiles);
					delete changes.groups;
				}
				angular.forEach(changes, function(val, key) {
					$this.stg[key] = filter.auto(val.newValue, key);
				});
				$rootScope.$apply();
			});
		});

	}]);