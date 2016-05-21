angular.module('FriendsApp')

	.controller('FriendsCtrl', [
			'$q',
			'$scope',
			'storage',
			'profileService',
		function ($q, $scope, storage, profile) {
			$q.all([storage.defer]).then(function ([stg, lang]) {
				$scope.stg = stg;
			});

		}
	]);