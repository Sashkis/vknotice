module SectionsApp {
	export class SidebarCtrl {
		public static $inject = [
			'storage',
		];

		stg: IStorageData;
		
		constructor(storage: StorageApp.StorageService) {
			storage.ready.then((stg) => {
				this.stg = stg;
			});
		}
	}
}
