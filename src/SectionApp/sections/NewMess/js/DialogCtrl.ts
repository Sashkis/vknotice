module SectionsApp {
	export class DialogCtrl {

		public static $inject = [
			'storage',
			'$attrs',
			'$scope',
		];

		constructor(private storage: StorageApp.StorageService, private $attrs: any, private $scope: any) {
			// storage.ready.then((stg) => {
			// 	this.dialogs = angular.copy(stg.dialogs_cache);
			// });
			console.log(this);
		}
	}
}
