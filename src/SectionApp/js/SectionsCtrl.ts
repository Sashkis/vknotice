module SectionsApp {
	export class SectionsCtrl {
		public static $inject = [
			'storage',
			'Analytics',
			'$state',
			'$scope',
		];

		constructor(
			private storage: StorageApp.StorageService,
			Analytics: any,
			$state: ng.ui.IStateService,
			$scope: ng.IScope
		) {
			storage.ready.then((stg) => {
				Analytics.set('&uid', stg.user_id);
				if (stg.state.params.peer_id) {
					const targetDialog = stg.dialogs.find((d) => d.peer_id === stg.state.params.peer_id);
					if (!targetDialog) {
						stg.state.name = 'dialogs';
						delete stg.state.params.peer_id;
					}
				}
				$state.go(stg.state.name, stg.state.params);
			});

			$scope.$on('$stateChangeSuccess', ($event, toState, toParams) => this.saveSection(toState, toParams));
		}

		saveSection(toState: ng.ui.IState, toParams: Object) {
			this.storage.set({
				state: {
					name: toState.name,
					params: toParams
				}
			});
		}
	}
}
