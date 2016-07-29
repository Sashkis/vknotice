module SectionsApp {
	export class NewMessCtrl {

		public static $inject = [
			'$vk',
			'storage',
			'$stateParams'
		];

		stg: IStorageData;
		isOpenDialog: boolean;
		stateParams: ng.ui.IStateParamsService;

		constructor(private $vk: VkApp.VkService, private storage: StorageApp.StorageService, $stateParams: ng.ui.IStateParamsService) {
			storage.ready.then((stg) => this.stg = stg);
			this.stateParams = $stateParams;
		}

		markAsRead(peer_id: number) {
			this.$vk.auth().then(() => {
				this.$vk.api('messages.markAsRead', {
					access_token: this.$vk.stg.access_token,
					peer_id,
				});
			});
		}
	}
}
