module SectionsApp {

  interface IFriendsResponse {
    count: number;
    items: IFriend[]
  }
  interface IFriend {
    id: number;
    first_name: string;
    last_name: string;
    photo_50: string;
    online: number;
    online_mobile?:number;
    online_app?:string;
    lists?: number[];

  }

	export class AllFriendsCtrl {

    friends: IFriend[];

		public static $inject = [
			'$vk'
		];

		constructor(private $vk: VkApp.VkService) {
      console.log('constructor');
			$vk.auth().then(() => this.updateUser());
		}

		updateUser() {
      console.log('updateUser');
			return this.$vk.api('friends.get', {
				access_token: this.$vk.stg.access_token,
				order: 'hints',
				fields: 'online,photo_50',
        count:500
			}).then((API: IFriendsResponse) => {
        this.friends = API.items;
				return API;
			})
		}

	}
}
