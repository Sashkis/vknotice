angular.module('PopupHeaderApp', ['StorageApp', 'PopupL10nApp'])

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
			$scope.isDropdownOpen = false;

			$q.all([storage.defer, i18n.defer]).then(function ([stg, lang]) {
				$scope.title = i18n.get('Informer');
				$scope.stg = stg;
				for (let i = $scope.stg.profiles.length - 1; i >= 0; i--) {
					if ($scope.stg.profiles[i].id == $scope.stg.user_id) {
						$scope.current_user = $scope.stg.profiles[i];
						break;
					}
				}
				$scope.menu = dropdownMenu();
			});

		}
	]);