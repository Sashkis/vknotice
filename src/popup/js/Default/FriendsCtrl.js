angular.module('FriendsApp')

	.controller('FriendsCtrl', [
			'$q',
			'$scope',
			'storage',
			'i18n',
		function ($q, $scope, storage, i18n) {
			$q.all([storage.defer, i18n.defer]).then(function ([stg, lang]) {
				$scope.stg = stg;
			});

		}
	]);