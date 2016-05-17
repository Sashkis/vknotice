angular.module('StorageApp', [])
	.service('storage', ['$q','$rootScope', function ($q,$rootScope) {
		let _this = this;
		let defer = $q.defer();
		_this.defer = defer.promise;

		chrome.storage.local.get(function (stg) {
			_this.stg = stg;
			$rootScope.$apply();
			defer.resolve(_this.stg)

			chrome.storage.onChanged.addListener(function (changes) {
				angular.forEach(changes, function(val, key) {
					_this.stg[key] = val.newValue;
				});
				$rootScope.$apply();
			});
		});
	}]);