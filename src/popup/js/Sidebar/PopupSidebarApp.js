angular.module('PopupSidebarApp', ['StorageApp', 'PopupL10nApp'])

	.controller('SidebarCtrl', [
			'$q',
			'$scope',
			'storage',
			'i18n',
			'sidebarMenu',
		function ($q, $scope, storage, i18n, sidebarMenu) {
			$q.all([storage.defer, i18n.defer]).then(function ([stg, lang]) {
				$scope.stg = stg;
				$scope.stg.counter.messages = 6;
				$scope.menu = sidebarMenu();
			});

		}
	]);