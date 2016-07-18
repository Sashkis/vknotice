interface IStorageData {
	access_token: string;
	user_id: number;
	options: IOptions;
	counter: {
		friends?: number;
		photos?: number;
		videos?: number;
		messages?: number;
		groups?: number;
		notifications?: number;
	};
	currentSection: string;
	friends: number[];
	newfriends: number[];
	dialogs: IDialog[];
	dialogs_cache: IDialog_cached[];
	groups: IProfile[];
	users: IProfile[];
	profiles: IProfile[];
	lang: number;
	notifyLast_viewed: number;
}


declare enum AudioOptionStatus {
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
	wall: boolean,
	mentions: boolean,
	comments: boolean,
	likes: boolean,
	reposts: boolean,
	followers: boolean,
	audio: AudioOptionStatus;
}

interface IDialog {
	unread?: number;
	message: IMessage;
	in_read: number;
	out_read: number;
}

interface IDialog_cached {
	id: number;
	unread?: number;
	message: IMessage[];
	in_read: number;
	out_read: number;
}

interface IMessage {
	id: number;
	user_id: number;
	from_id: number;
	date: Date;
	read_state: number;
	out: number;
	title: string;
	body: string;
	geo: any;
	attachments?: any[];
	fwd_messages?: any[];
	emoji: number;
	important: number;
	deleted: number;
	random_id: number;
	chat_id?: number;
	chat_active?: number[];
	push_settings?: any;
	users_count?: number;
	admin_id?: number;

}
interface IAttachment {
	type: string;
	[type: string]: any;
}

declare enum OnlineStatus {
	Offline,
	Online,
}

interface IProfile {
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
