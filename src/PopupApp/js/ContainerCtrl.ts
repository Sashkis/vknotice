module PopupApp {
	export class ContainerCtrl {
		public static $inject = [
			'$vk',
			'storage',
			'Analytics',
		];

		stg: IStorageData;

		constructor(private $vk: VkApp.VkService, private storage: StorageApp.StorageService, private Analytics: any) {
			storage.ready.then(stg => this.stg = stg);
		}

		isAuth() {
			return !!(this.$vk.stg && this.$vk.stg.access_token && this.$vk.stg.user_id);
		}

		auth() {
			this.Analytics.trackEvent('OAuth', 'login');
			chrome.runtime.reload();
		}
	}
}
