module SectionsApp {
	export class NewMessCtrl {
		dialogs: IDialog_cached[];

		public static $inject = [
			'storage',
		];

		constructor(private storage: StorageApp.StorageService) {
			storage.ready.then((stg) => {
				this.dialogs = angular.copy(stg.dialogs_cache);
			});
		}
	}
}
