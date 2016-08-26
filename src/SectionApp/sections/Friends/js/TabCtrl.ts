module SectionsApp {
	export class TabCtrl {
		public static $inject = ['storage'];
    stg: IStorageData;

		constructor (private storage: StorageApp.StorageService, private $vk: VkApp.VkService) {
			storage.ready.then((stg) => {
				this.stg = stg;
			});
		}
  }
}
