module SectionsApp {
	export class FriendsCtrl {

		public static $inject = ['storage'];

		friends: {
			count: number;
			items: (IProfile | {})[];
		};

		constructor (storage: StorageApp.StorageService) {
			storage.ready.then((stg) => {
				const friends = angular.copy(stg.friends);
				this.friends = {
					count: friends.count,
					items: friends.items.map((id) => storage.getProfile(id)),
				}
			});
		}
	}
}
