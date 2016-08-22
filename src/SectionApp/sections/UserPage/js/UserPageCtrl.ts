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
		photo_200_orig: string;
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

		constructor(private $vk: VkApp.VkService, $stateParams: IUserPageStateParams) {
			$vk.auth().then(() => {
				$vk.api('users.get', {
					user_ids: $stateParams.user_id,
					fields: [
						'bdate',
						'can_send_friend_request',
						'can_write_private_message',
						'city',
						'counters',
						'country',
						'friend_status',
						'online',
						'photo_200_orig',
						'relation',
						'sex',
						'status',
						'verified',
					].join(',')
				}).then((API: IUser[]) => {
					this.user = API[0];
				})
			});
		}

	}
}
