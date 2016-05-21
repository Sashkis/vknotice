angular.module('FriendsApp')

	.controller('FriendsCtrl', [
			'$q',
			'$scope',
			'storage',
		function ($q, $scope, storage) {
			$q.all([storage.defer]).then(function ([stg, lang]) {
				$scope.stg = stg;
			});

		}
	]);