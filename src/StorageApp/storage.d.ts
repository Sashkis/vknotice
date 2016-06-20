interface IStorageData {
	access_token?: string;
	user_id?: string | number;
	options?: IOptions;
	counter?: {
		friends?: number;
		photos?: number;
		videos?: number;
		messages?: number;
		groups?: number;
		notifications?: number;
	};
	currentSection?: string;
	friends?: number[];
	newfriends?: number[];
	dialogs?: IDialog[];
	groups?: IProfiles[];
	users?: IProfiles[];
	profiles?: IProfiles[];
	lang?: number;
	lastOpenComment?: number;
}


declare enum OptionsStatus {
	Never,
	SomeConditions,
	Always,
}

interface IOptions {
	friends: boolean;
	photos: boolean;
	videos: boolean;
	messages: boolean;
	groups: boolean;
	notifications: boolean;
	comments: boolean;
	audio: number;
}

interface IDialog {
	unread?: number;
	message: IMessage[];
	in_read: number;
	out_read: number;
}

interface IMessage {
	id: number;
	date: Date;
	out: number;
	user_id: number;
	read_state: number;
	title: string;
	body: string;
	random_id: number;
}

declare enum OnlineStatus {
	Offline,
	Online,
}

interface IProfiles {
	id: number;
	first_name?: string;
	last_name?: string;
	name?: string;
	screen_name: string;
	photo_100: string;
	online: OnlineStatus;
	online_mobile?: OnlineStatus;
	online_app?: string;
	status: string;

	is_closed?: number;
	type?: string;
	is_admin?: number;
	admin_level?: number;
	is_member?: number;
}
