module SectionsApp {
	export class NewFriendsCtrl {
		public static $inject = ['$scope', 'storage', '$vk'];

		stg: IStorageData;

		constructor (private $scope: ng.IScope, private storage: StorageApp.StorageService, private $vk: VkApp.VkService) {
			storage.ready.then((stg) => {
				this.stg = stg;
			});
		}

		mark($event: ng.IAngularEvent, type: string, user_id: number) {
			$event.preventDefault();

			let method: string;

			switch (type) {
				case 'add':       method = 'friends.add'; break;
				case 'delete':    method = 'friends.delete'; break;
				case 'ban':       method = 'account.banUser'; break;
				default:          method = '';
			}

			if (method) {
				this.$vk.auth().then(() => {
					this.$vk.api(method, {
						user_id:      user_id,
						access_token: this.$vk.stg.access_token,
					}).then(() => {
						this.$scope.$emit('requestRemoved');
					});
				});
			}
		}
	}
}
