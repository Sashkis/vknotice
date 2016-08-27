module SectionsApp {
	export class TabCtrl {
		public static $inject = ['$scope', 'storage', '$state'];
    stg: IStorageData;

		constructor ($scope: ng.IScope, storage: StorageApp.StorageService, $state: ng.ui.IStateService) {
			storage.ready.then((stg) => {
				this.stg = stg;
			});

			$scope.$on('requestRemoved', () => {
				if (this.stg && this.stg.newfriends && this.stg.newfriends.length === 1 && $state.is('friends.requests')) {
					$state.go('friends.all');
				}
			});
		}
  }
}
