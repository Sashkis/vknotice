module SectionsApp {


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

	interface IMessageMap {
		isMore: boolean,
		peer_id: number,
		items: IMessage[],
	}

	export class NewMessCtrl {
		stg: IStorageData;
		currentMessMap: IMessageMap | undefined;
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
			'$vk',
			'$scope',
			'deamon',
			'messMap',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private $vk: VkApp.VkService,
			private $scope: ng.IScope,
			private deamon: DeamonApp.DeamonService,
			private messMap: MessMapService
		) {



			storage.ready.then((stg) => {
				this.stg = stg;

				this.currentMessMap = messMap.getMessMap();
				if (this.currentMessMap) {
					const targetPeer_id = this.currentMessMap.peer_id;

					$vk.auth().then(() => {
						this.loadHistory(targetPeer_id).then((API: executeGetHistoryResponse) => {
							storage.setProfiles(API.profiles);

							messMap.insertMessages(targetPeer_id, API.history.items);
							messMap.setMore(targetPeer_id, API.history.count);

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

		loadHistory(peer_id: number, offset = 0, count = 20) {
			return this.$vk.api('execute.getHistory', {
				access_token: this.$vk.stg.access_token,
				peer_id,
				count,
				offset,
			});
		}



		loadMore(peer_id: number) {
			const targetMessMap = this.messMap.getMessMap(peer_id);
			if (!targetMessMap) return;
			const offset = targetMessMap.items ? targetMessMap.items.length : 0;

			this.loadHistory(peer_id, offset).then((API: executeGetHistoryResponse) => {
				this.messMap.insertMessages(peer_id, API.history.items, false);
			});
		}

		onLongPollDone(API: any) {
			this.LongPollParams.pts = API.new_pts;

			if (angular.isArray(API.profiles)) {
				this.storage.setProfiles(API.profiles);
			}

			if (!this.currentMessMap) return true;

			angular.forEach(API.history, (event) => {
				// console.log(event);
				switch (event[0]) {

					case 4 : const [event_code, message_id, flags, peer_id] = event;
						const message = API.messages.items.find((m: IMessage) => m.id === message_id);
						this.messMap.insertMessages(peer_id, [message], false, true);
						// targetDialog.message.unshift(message);
					break;

					default:
						console.log(event);
				}
			});

			return true;
		}

		// getDialog(peer_id = +this.$routeParams.peer_id ) {
		// 	if (!this.stg || !this.stg.dialogs.length || !peer_id ) return;
		// 	return this.stg.dialogs.find((dialog) => peer_id === dialog.peer_id);
		// }



		markAsRead(peer_id: number) {
			this.$vk.auth().then(() => {
				this.$vk.api('messages.markAsRead', {
					access_token: this.$vk.stg.access_token,
					peer_id,
				});
			});
		}

		sendMessage() {
			if (!this.currentMessMap) return;
			const peer_id = this.currentMessMap.peer_id;
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
