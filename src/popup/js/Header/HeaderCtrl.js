angular.module('PopupHeaderApp')

	.config([
		'$compileProvider',
	    function($compileProvider) {
	    	// Разрешить ссылки chrome-extension://
	        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	    }
	])

	.controller('HeaderCtrl', [
			'$q',
			'$scope',
			'storage',
			'i18n',
			'dropdownMenu',
		function ($q, $scope, storage, i18n, dropdownMenu) {
			$scope.log = function (a) {
				console.log(a);
			}
			$scope.isDropdownOpen = false;

			$q.all([storage.defer, i18n.defer]).then(function ([stg, lang]) {
				$scope.title = i18n.get('Informer');
				$scope.stg = stg;
				$scope.current_user = $scope.stg.profiles[ $scope.stg.user_id ];
				$scope.menu = dropdownMenu();
			});

		}
	]);