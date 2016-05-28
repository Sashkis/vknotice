angular.module('SectionsApp')

	.controller('FriendsCtrl', [
			'$scope',
			'storage',
		function ($scope, storage) {
			storage.ready.then(function (stg) {
				$scope.stg = stg;
			});

		}
	])

	.directive('friend', ['profile', function(profile) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl:'../SectionApp/sections/Default/friend.tpl',
			scope: {
				id: '='
			},
			link: function ($scope) {
				$scope.user = profile.getById($scope.id)
	        }
		};
	}]);