angular.module('StorageApp', ['ProfileApp'])

	.factory('filter', ['profileService', function ($prof) {
		let profileSrc;

		function auto_filter (val, key) {
			if (this[key] !== undefined) return this[key](val);
			else return default_filter(val);
		}

		function index_users_filter(profiles, target) {
			const indexed_list = angular.isArray(target) ? {} : angular.isObject(target) ? target : {};
			angular.forEach(profiles, function (data) {
				indexed_list[data.id] = $prof.create(data);
			});
			return indexed_list;
		}

		function replace_id_to_user_filter (array_ids) {
			return array_ids.map((user_id) => {
				return profileSrc.profiles[user_id] || {};
			});
		}

		function default_filter (val) {
			return val;
		}

		return {
			setProfileSrc: (src) => profileSrc = src,
			auto: auto_filter,
			profiles: index_users_filter,
			friends: replace_id_to_user_filter
		}

	}])

	.service('storage', ['$q','$rootScope','filter','profileService', function ($q,$rootScope,filter,$prof) {
		let $this = this;
		let defer = $q.defer();
		$this.defer = defer.promise;

		chrome.storage.local.get(function (stg) {
			$this.stg = angular.extend({}, stg);
			$prof.setSrc($this.stg);

			$this.stg.profiles = filter.profiles(stg.users, $this.stg.profiles);
			$this.stg.profiles = filter.profiles(stg.groups, $this.stg.profiles);
			filter.setProfileSrc($this.stg);

			$this.stg.friends = filter.friends(stg.friends, $this.stg.profiles);

			delete $this.stg.users;
			delete $this.stg.groups;

			$rootScope.$apply();
			defer.resolve($this.stg)

			chrome.storage.onChanged.addListener(function (changes) {
				if (changes.users !== undefined) {
					console.log('users');
					$this.stg.profiles = filter.profiles(changes.users.newValue, $this.stg.profiles);
					delete changes.users;
				}
				if (changes.groups !== undefined) {
					console.log('groups');
					$this.stg.profiles = filter.profiles(changes.groups.newValue, $this.stg.profiles);
					delete changes.groups;
				}
				angular.forEach(changes, function(val, key) {
					console.log(key);
					$this.stg[key] = filter.auto(val.newValue, key);
				});
				$rootScope.$apply();
			});
		});

	}]);