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

	export class ChatCtrl {
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
			'$stateParams',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private $vk: VkApp.VkService,
			private $scope: ng.IScope,
			private deamon: DeamonApp.DeamonService,
			private messMap: MessMapService,
			private $stateParams: IDialogRouteParams
		) {
			storage.ready.then((stg) => {

				this.currentMessMap = messMap.getMessMap();
				if (this.currentMessMap) {
					const targetPeer_id = this.currentMessMap.peer_id;

					$vk.auth().then(() => {
						this.loadMore(targetPeer_id).then((API: executeGetHistoryResponse) => {

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

								$scope.$on('$destroy', () => {
									deamon.stop();
								});

								$scope.$on('$stateChangeSuccess', ($event: ng.IAngularEvent, toState: string, toParams: {peer_id: string}) => {
									this.currentMessMap = messMap.getMessMap(+toParams.peer_id);
									if (toParams.peer_id) this.loadMore(+toParams.peer_id)
								});

						});
					});
				}
			});
		}

		isGroup() {
			const peer_id = +this.$stateParams.peer_id;
			if (!peer_id) return false;

			const dialog = this.storage.stg.dialogs.find(d => d.peer_id === peer_id);
			if (!dialog) return false;
			return dialog.type === 1;
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
			const offset = targetMessMap && targetMessMap.items ? targetMessMap.items.length : 0;

			return this.loadHistory(peer_id, offset).then((API: executeGetHistoryResponse) => {
				this.storage.setProfiles(API.profiles);

				this.messMap.insertMessages(peer_id, API.history.items);
				this.messMap.setMore(peer_id, API.history.count);

				return API;
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

					case 4 : {
						const [event_code, message_id, flags, peer_id] = event;
						const message = API.messages.items.find((m: IMessage) => m.id === message_id);
						this.messMap.insertMessages(peer_id, [message], true );
					} break;
					case 6 : case 7 : {
						const [event_code, peer_id , local_id] = event;
						const messMap = this.messMap.getMessMap(peer_id);
						if (messMap) messMap.items.filter(m => m.out === (event_code === 6 ? 0 : 1) && m.id <= local_id ).map(m => m.read_state = 1);
					} break;

					default:
						// console.log(event);
				}
			});

			return true;
		}

		sendMessage($event: KeyboardEvent) {
			if (!this.currentMessMap || !this.message) return;
			if ($event.ctrlKey) {
				this.message += "\n";
				return;
			}
			
			$event.preventDefault();

			const peer_id = this.currentMessMap.peer_id;
			const message = this.message;

			this.$vk.auth().then(() => this.$vk.api('messages.send', {
				access_token: this.$vk.stg.access_token,
				message,
				peer_id,
			})).then((API) => {
				this.message = '';
			});
		}

	}
}
