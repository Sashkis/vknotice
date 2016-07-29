module PopupApp {
	export class ContainerCtrl {
		public static $inject = [
			'$vk',
			'storage',
		];

		stg: IStorageData;

		constructor(private $vk: VkApp.VkService, private storage: StorageApp.StorageService) {
			storage.ready.then(stg => this.stg = stg);
		}

		isAuth() {
			return !!(this.$vk.stg && this.$vk.stg.access_token && this.$vk.stg.user_id);
		}

		auth() {
			chrome.runtime.reload();
			// return this.$vk.auth();
		}
	}
}
