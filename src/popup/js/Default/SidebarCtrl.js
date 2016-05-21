angular.module('SidebarApp')

	.controller('SidebarCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.defer.then(function (stg) {
				$scope.stg = stg;
			});

		}
	]);