angular.module('SectionsApp')
	.controller('NewFriendsCtrl', [
		'$scope',
		'storage',
		function ($scope, storage) {
			storage.ready.then(function (stg) {
				$scope.stg = stg;
				console.log(stg);
			});

		}
	]);
