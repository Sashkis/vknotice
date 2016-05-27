angular.module('SectionsApp')

	.controller('FriendsCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.ready.then(function (stg) {
				$scope.stg = stg;
			});

		}
	]);