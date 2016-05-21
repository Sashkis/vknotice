angular.module('FriendsApp')

	.controller('FriendsCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.defer.then(function (stg) {
				$scope.stg = stg;
			});

		}
	]);