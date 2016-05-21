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
			'profileService',
			'dropdownMenu',
		function ($q, $scope, storage, i18n, $prof, dropdownMenu) {
			$scope.isDropdownOpen = false;

			$q.all([storage.defer, i18n.defer]).then(function ([stg, lang]) {
				$scope.title = i18n.get('Informer');
				$scope.stg = stg;
				$scope.current_user = $prof.getById($scope.stg.user_id);
				$scope.menu = dropdownMenu();
			});

		}
	]);