angular.module('SectionsApp')

	.controller('SidebarCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.onLoad.then(function (stg) {
				$scope.stg = stg;
			});

		}
	]);