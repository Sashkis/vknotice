angular.module('SectionsApp')

	.controller('FriendsCtrl', ['storage',
		function (storage) {
			const vm = this;

			storage.ready.then(function (stg) {
				vm.stg = stg;
			});

		},
	])

	.directive('friend', ['storage', function (storage) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl:'../SectionApp/sections/Default/friend.tpl',
			scope: {
				id: '=',
			},
			link: function ($scope) {
				$scope.user = storage.getProfile($scope.id);
			},
		};
	}]);
