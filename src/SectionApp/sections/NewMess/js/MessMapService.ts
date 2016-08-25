/// <reference path="../../../../all.d.ts"/>
module SectionsApp {

	export interface IMessageMap {
		isMore: boolean,
		peer_id: number,
		items: IMessage[],
	}

	export interface IDialogRouteParams extends ng.ui.IStateService {
		peer_id: string,
	}

	export class MessMapService {
		maps: IMessageMap[];
		stg = <IStorageData>{};

		public static $inject = [
			'storage',
			'$stateParams',
			// '',
		];

		constructor(storage: StorageApp.StorageService, private $stateParams: IDialogRouteParams) {
			storage.ready.then((stg) => {
				this.maps = stg.dialogs.map(d => ({peer_id: d.peer_id, isMore: false, items: []}));
			});
		}

		getMessMap(peer_id = +this.$stateParams.peer_id ) {
			if (!peer_id) return;
			let map = this.maps.find((d) => peer_id === d.peer_id);
			if (!map) {
				map = {
					peer_id,
					isMore: false,
					items: [],
				};
				this.maps.push(map);
			}
			return map;
		}

		insertMessages(peer_id: number, messages: IMessage[], prepend = false, clearBeforInsert = false ) {
			const targetMessMap = this.getMessMap(peer_id);
			if (!targetMessMap) return;

			if (clearBeforInsert) targetMessMap.items = [];
			messages = messages.map((m: IMessage) => new Message(m));
			return targetMessMap.items[prepend ? 'unshift' : 'push'](...messages);
		}

		setMore(peer_id: number, count: number) {
			const targetMessMap = this.getMessMap(peer_id);
			if (targetMessMap && count && targetMessMap.items.length < count)
				targetMessMap.isMore = true;
		}

	}
}
