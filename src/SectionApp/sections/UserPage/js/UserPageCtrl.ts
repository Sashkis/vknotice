module SectionsApp {

	export interface IUserPageStateParams extends ng.ui.IStateService {
		user_id: string,
	}

	enum Friend_Status {
		NotFriend,
		OutgoingRequest,
		IncomingRequest,
		IsFriend,
	}
	enum Relation {
		Unknown,
		Single,
		InRelationship,
		Engaged,
		Married,
		Complicated,
		ActivelySearching,
		Love,
	}

	export interface IUser extends ng.ui.IStateService {
		id: number;
		first_name: string;
		last_name: string;
		bdate?: string;
		bdate_obj?: {
			bday: string | undefined;
			bmonth: string | undefined;
			byear: string | undefined;
		};
		can_send_friend_request: number;
		can_write_private_message: number;
		city?: {
			id: number;
			title: string;
		}
		counters: {
			albums: number;
			videos: number;
			audios: number;
			photos: number;
			notes: number;
			friends: number;
			groups: number;
			online_friends: number;
			mutual_friends: number;
			user_videos: number;
			followers: number;
			pages: number;
		}
		country?: {
			id: number;
			title: string;
		},
		friend_status: Friend_Status;
		online: number;
		photo_100: string;
		photo_max_orig: string;
		relation: Relation;
		sex: number;
		status: string;
		verified: number;
	}

	export class UserPageCtrl {

		public static $inject = [
			'$vk',
			'$stateParams'
		];

		user: IUser;

		constructor(private $vk: VkApp.VkService, private $stateParams: IUserPageStateParams) {
			$vk.auth().then(() => this.updateUser());
		}

		action(method: string, user_id: number) {
			if (method === 'ban') method = 'account.banUser';
			else method = `friends.${method}`;

			this.$vk.api(method, {
				access_token: this.$vk.stg.access_token,
				user_id
			})
				.then(() => this.updateUser());
		}

		updateUser(user_id = this.$stateParams.user_id) {
			return this.$vk.api('users.get', {
				access_token: this.$vk.stg.access_token,
				user_ids: user_id,
				fields: [
					'bdate',
					'can_send_friend_request',
					'can_write_private_message',
					'city',
					'counters',
					'country',
					'friend_status',
					'online',
					'photo_100',
					'photo_max_orig',
					'relation',
					'sex',
					'status',
					'verified',
				].join(',')
			}).then((API: IUser[]) => {
				this.user = API[0];

				if (this.user.sex === 0) this.user.sex = 1;
				if (this.user.bdate) {
					const [bday, bmonth, byear] = this.user.bdate.split('.');
					this.user.bdate_obj = {bday, bmonth, byear};
				}
				console.log(this.user);
				return API;
			})
		}

	}
}
