angular.module('StorageApp', [])
	.service('storage', ['$q','$rootScope', function ($q,$rootScope) {
		let $this = this;
		let defer = $q.defer();
		$this.defer = defer.promise;

		chrome.storage.local.get(function (stg) {
			$this.stg = stg;
			$this.stg.profiles = filter(stg.profiles, 'profiles');
			$this.stg.friends = filter(stg.friends, 'friends');



			$rootScope.$apply();
			defer.resolve($this.stg)

			chrome.storage.onChanged.addListener(function (changes) {
				if (changes.profiles !== undefined) {
					$this.stg.profiles = filter(changes.profiles.newValue, 'profiles');
					delete changes.profiles;
				}
				angular.forEach(changes, function(val, key) {
					$this.stg[key] = filter(val.newValue, key);
				});
				$rootScope.$apply();
			});
		});

		function filter (val, key) {
			switch (key) {
				case 'profiles' : return index_users(val);
				case 'friends' : return replace_id_to_user(val);
				default : return val;
			}
		}

		function index_users(users) {
			const indexed_list = angular.isArray(users) ? {} : users;
			angular.forEach(users, function (user) {
				indexed_list[user.id] = user;
			});
			return indexed_list;
		}

		function replace_id_to_user (array_ids) {
			return array_ids.map((user_id) => {
				return $this.stg.profiles[user_id] || {};
			});
		}
	}]);