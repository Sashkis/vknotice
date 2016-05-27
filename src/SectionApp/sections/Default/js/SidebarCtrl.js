angular.module('SectionsApp')

	.controller('SidebarCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.ready.then(function (stg) {
				$scope.stg = stg;
			});

		}
	]);