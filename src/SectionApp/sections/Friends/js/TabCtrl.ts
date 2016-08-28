module SectionsApp {
	export class TabCtrl {
		public static $inject = ['$scope', 'storage', '$state'];
    stg: IStorageData;
		requests: number;

		constructor ($scope: ng.IScope, storage: StorageApp.StorageService, $state: ng.ui.IStateService) {
			storage.ready.then((stg) => {
				this.stg = stg;
				this.requests = stg.newfriends.length;
			});

			$scope.$on('requestRemoved', () => {
				this.requests--;
				if ($state.is('friends.requests') && this.requests === 0) {
					$state.go('friends.all', null, {location: 'replace'});
				}
			});
		}
  }
}
