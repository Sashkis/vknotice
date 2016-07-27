module SectionsApp {

	interface IDialogRouteParams extends angular.route.IRouteParamsService {
		peer_id: string,
		message: string,
	}

	interface executeGetHistoryResponse {
		history: executeGetHistoryResponse_History
		profiles: IProfile[],
		server: {
			ts: number,
			pts: number,
			server: string,
			key: string,
		},
	}
	interface executeGetHistoryResponse_History  {
		count: number,
		items: IMessage[],
		unread?: number
	}

	export class NewMessCtrl {
		stg: IStorageData;
		currentDialog: IDialog | undefined;
		message: string;
		isMore: boolean = false;
		LongPollParams: {
			access_token: string,
			ts: number,
			pts:number,
			fields: string,
		};

		public static $inject = [
			'storage',
			'$routeParams',
			'$vk',
			'$scope',
			'deamon',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private $routeParams: IDialogRouteParams,
			private $vk: VkApp.VkService,
			private $scope: ng.IScope,
			private deamon: DeamonApp.DeamonService
		) {



			storage.ready.then((stg) => {
				this.stg = stg;

				this.currentDialog = this.getCurrentDialog();
				if (this.currentDialog) {
					const targetID = this.currentDialog.peer_id;

					$vk.auth().then(() => {
						this.loadHistory(targetID).then((API: executeGetHistoryResponse) => {
							storage.setProfiles(API.profiles);

							this.insertMessages(targetID, API.history);

							this.LongPollParams = {
								access_token: $vk.stg.access_token,
								ts: API.server.ts,
								pts: API.server.pts,
								fields: 'screen_name,status,photo_50,online',
							};

							deamon
								.setConfig({
									method: 'messages.getLongPollHistory',
									params: this.LongPollParams,
									interval: 1000,
									DoneCB: (resp)	=> this.onLongPollDone(resp),
								})
								.start();

								$scope.$on('$destroy', function() {
									deamon.stop();
								});

						});
					});
				}
			});
		}

		loadHistory(peer_id: number, offset = 0, count = 10) {
			return this.$vk.api('execute.getHistory', {
				access_token: this.$vk.stg.access_token,
				peer_id,
				count,
				offset,
			});
		}

		insertMessages(peer_id: number, history: executeGetHistoryResponse_History, clearBeforInsert = true) {
			if (this.currentDialog && this.currentDialog.peer_id === peer_id) {
				this.currentDialog.unread = history.unread || 0;

				history.items = history.items.map((mess: IMessage) => new Message(mess));
				if (clearBeforInsert || !this.currentDialog.message || !angular.isArray(this.currentDialog.message)) {
					this.currentDialog.message = [];
				}

				this.currentDialog.message = this.currentDialog.message.concat(history.items);

				this.isMore = history.count > this.currentDialog.message.length;
			}
		}

		loadMore(peer_id: number) {
			if (!this.currentDialog) return;
			if (!this.currentDialog.message) this.currentDialog.message = [];

			this.loadHistory(peer_id, this.currentDialog.message.length).then((API: executeGetHistoryResponse) => {
				this.insertMessages(peer_id, API.history, false);
			});
		}

		onLongPollDone(API: any) {
			this.LongPollParams.pts = API.new_pts;

			if (angular.isArray(API.profiles)) {
				this.storage.setProfiles(API.profiles);
			}

			if (!this.currentDialog) return true;

			const targetID = this.currentDialog.peer_id;
			angular.forEach(API.history, (event) => {
				// console.log(event);
				switch (event[0]) {

					case 4 : const [event_code, message_id, flags, peer_id] = event;
						if (peer_id !== targetID || !this.currentDialog) return;

						const message = new Message( API.messages.items.find((mess: IMessage) => mess.id === message_id) );
						if (!this.currentDialog.message) this.currentDialog.message = [];
						this.currentDialog.message.unshift(message);
					break;

					default:
						console.log(event);
				}
			});

			return true;
		}

		getCurrentDialog() {
			if (!this.stg || !this.stg.dialogs.length || !this.$routeParams.peer_id ) return;
			const targetID = +this.$routeParams.peer_id;
			return this.stg.dialogs.find((dialog: IDialog) => targetID === dialog.peer_id);
		}

		markAsRead(peer_id: number) {
			this.$vk.auth().then(() => {
				this.$vk.api('messages.markAsRead', {
					access_token: this.$vk.stg.access_token,
					peer_id,
				});
			});
		}

		sendMessage() {
			if (!this.currentDialog) return;
			const peer_id = this.currentDialog.peer_id;
			const message = this.message;
			this.$vk.auth().then(() => {
				this.$vk.api('messages.send', {
					access_token: this.$vk.stg.access_token,
					message,
					peer_id,
				}).then((API:number) => {
					this.message = '';
				});
			});
		}


	}
}
