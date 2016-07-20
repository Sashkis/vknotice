module SectionsApp {

	interface IDialogRouteParams extends angular.route.IRouteParamsService {
		peer_id: string,
	}

	export class NewMessCtrl {
		dialogs: IDialog_cached[] = [];

		public static $inject = [
			'storage',
			'$routeParams',
		];

		constructor(private storage: StorageApp.StorageService, private $routeParams: IDialogRouteParams) {
			console.log($routeParams);
			storage.ready.then((stg) => {
				this.dialogs = angular.copy(stg.dialogs_cache);
			});
		}
		getCurrentDialog() {
			if (!this.dialogs.length || !this.$routeParams.peer_id ) return;
			const targetID = +this.$routeParams.peer_id
			for (let i = 0; i < this.dialogs.length; i++) {
				if (targetID === this.dialogs[i].id) return this.dialogs[i];
			}
		}
	}
}
