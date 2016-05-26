angular.module('SectionsApp')

	.controller('FriendsCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.onLoad.then(function (stg) {
				$scope.stg = stg;
			});

		}
	]);