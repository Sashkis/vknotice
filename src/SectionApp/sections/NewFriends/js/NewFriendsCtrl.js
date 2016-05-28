angular.module('SectionsApp')
	.controller('NewFriendsCtrl', [
		'$scope',
		'storage',
		function ($scope, storage) {
			storage.ready.then(function (stg) {
				$scope.stg = stg;
			});

		}
	])

	.directive('request', ['profile', function(profile) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl:'../SectionApp/sections/NewFriends/request.tpl',
			scope: {
				id: '='
			},
			link: function ($scope) {
				$scope.user = profile.getById($scope.id)
	        }
		};
	}]);
