angular.module('StorageApp', [])
	.provider('storage', [function () {
		var onLoad = function () {};
		var onChanged = function () {};

		return {
			set_onChanged_callback: function (cb) {
				onChanged = cb;
			},

			set_onLoad_callback: function (cb) {
				onLoad = cb;
			},

			$get: ['$q', '$rootScope', function ($q, $rootScope) {
				var ready = $q.defer();
				var storage = {
					ready: ready.promise,
					stg: {},
					set: function (data, cb) {
						chrome.storage.local.set(data, cb);
					}
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
			}]
		};
	}]);