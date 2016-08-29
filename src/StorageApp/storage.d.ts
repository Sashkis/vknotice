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
	friends: {
		count: number;
		items: number[];
	};
	newfriends: number[];
	dialogs: IDialog[];
	groups: IProfile[];
	users: IProfile[];
	profiles: IProfile[];
	lang: number;
	notifyLast_viewed: number;
	state: {
		name: string,
		params: any,
	},
	alerts: IAlert[];
}

type IAlert = IAlert_Simple;

interface IAlert_Simple {
	id: string;
	type: string;
	ancor: string;
	url: string;
	isClose?: boolean;
	header?: string;
	text?: string;
	img?: string;
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
	peer_id: number;
	unread?: number;
	title?: string;
	in_read: number;
	out_read: number;
	type: SectionsApp.DialogType;
	profiles: number[];
	message?: IMessage[];
	photo_50?: string;
	isMore?: boolean;
}

interface IVkDialog {
	unread?: number;
	in_read: number;
	out_read: number;
	message: IMessage;
}

interface IMessage {
	id: number;
	body: string;
	user_id: number;
	from_id: number;
	date: number;
	read_state: number;
	out: number;
	title?: string;
	geo?: any;
	attachments?: any[];
	fwd_messages?: any[];
	emoji?: number;
	important?: number;
	deleted?: number;
	random_id?: number;
	chat_id?: number;
	chat_active?: number[];
	push_settings?: any;
	users_count?: number;
	admin_id?: number;
	photo_50?: string;
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
	photo_50: string;
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
