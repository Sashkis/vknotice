module SectionsApp {

	interface IDialogRouteParams extends angular.route.IRouteParamsService {
		peer_id: string,
	}

	export class NewMessCtrl {
		stg: IStorageData;
		currentDialog: IDialog | undefined;

		public static $inject = [
			'storage',
			'$routeParams',
			'$vk',
			'$scope',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private $routeParams: IDialogRouteParams,
			private $vk: VkApp.VkService,
			private $scope: ng.IScope
		) {
			storage.ready.then((stg) => {
				this.stg = stg;

				this.currentDialog = this.getCurrentDialog();
				if (this.currentDialog) {
					$vk.auth().then(() => {
						console.log(this.currentDialog);
						$vk.api('messages.getHistory', {
							access_token: $vk.stg.access_token,
							peer_id: this.currentDialog.peer_id,
							// offset: this.currentDialog.unread ? -this.currentDialog.unread : 0,
							// start_message_id:-1,
							count:100,
							// rev: 1,
						}).then((API: any) => {
							if (this.currentDialog) {
								this.currentDialog.unread = API.unread | 0;
								// this.currentDialog.in_read = API.in_read;
								// this.currentDialog.out_read = API.out_read;
								this.currentDialog.message = API.items;

									var sel = `message-${this.currentDialog.message[ this.currentDialog.message.length-1 ].id}`;
									var a = document.getElementById(sel);
									console.log(sel, a);
							}
						})
					});
				}
			});
		}

		getCurrentDialog() {
			if (!this.stg || !this.stg.dialogs.length || !this.$routeParams.peer_id ) return;
			const targetID = +this.$routeParams.peer_id
			for (let i = 0; i < this.stg.dialogs.length; i++) {
				if (targetID === this.stg.dialogs[i].peer_id) return this.stg.dialogs[i];
			}
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
