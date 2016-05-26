angular.module('SectionsApp')
	.controller('NewFriendsCtrl', [
		'$scope',
		'storage',
		function ($scope, storage) {
			storage.onLoad.then(function (stg) {
				$scope.stg = stg;
				console.log(stg);
			});

		}
	]);
