/// <reference path="../../../../all.d.ts"/>
module SectionsApp {

	interface IMessageMap {
		isMore: boolean,
		peer_id: number,
		items: IMessage[],
	}

	export interface IDialogRouteParams extends angular.route.IRouteParamsService {
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
				this.maps = stg.dialogs.map(d => { return {peer_id: d.peer_id, isMore: false, items: []}});
			});
		}

		getMessMap(peer_id = +this.$stateParams.peer_id ) {
			if (!peer_id) return;
			return this.maps.find((d) => peer_id === d.peer_id);
		}

		insertMessages(peer_id: number, messages: IMessage[], prepend = false, clearBeforInsert = false ) {
			const targetMessMap = this.getMessMap(peer_id);
			if (!targetMessMap) return;

			messages = messages.map((m: IMessage) => new Message(m));
			if (clearBeforInsert) {
				targetMessMap.items = [];
			}

			if (!prepend) targetMessMap.items = targetMessMap.items.concat(messages);
			else targetMessMap.items = messages.concat(targetMessMap.items);
			return targetMessMap.items.length;
		}

		setMore(peer_id: number, count: number) {
			const targetMessMap = this.getMessMap(peer_id);
			if (targetMessMap && count && targetMessMap.items.length < count)
				targetMessMap.isMore = true;
		}

	}
}
