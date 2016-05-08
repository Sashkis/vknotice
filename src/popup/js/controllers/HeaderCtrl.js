angular.module('PopupApp')
	.controller('HeaderCtrl', function ($scope) {

		new App().load(['user_id', 'profiles', 'counter']).done(stg => {
			for (let i = stg.profiles.length - 1; i >= 0; i--) {
				if (stg.profiles[i].id == stg.user_id) {
					$scope.current_user = stg.profiles[i];
					break;
				}
			}

			$scope.notifications = stg.counter.notifications;

			$scope.$apply();
		});

		chrome.storage.onChanged.addListener(changes => {
			if (changes.counter !== undefined) {
				$scope.notifications = changes.counter.newValue.notifications;
				$scope.$apply();
			}
		});
	});