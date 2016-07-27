module SectionsApp {

	export enum DialogType {
		User,
		Chat,
		Group,
	}

	export class Dialog implements IDialog {
		peer_id: number;
		in_read: number;
		out_read: number;
		unread: number = 0;
		type: DialogType;
		title: string;
		photo_50: string | undefined;
		profiles: number[] = [];

		constructor(dialog: IVkDialog) {
			// console.log(dialog);
			this.in_read = dialog.in_read;
			this.out_read = dialog.out_read;
			this.unread = dialog.unread || 0;

			if (dialog.message.chat_id) {
				this.title = dialog.message.title || '';
				this.type = DialogType.Chat;
				this.peer_id = 2000000000 + dialog.message.chat_id;
				if (dialog.message.chat_active && angular.isArray(dialog.message.chat_active))
					this.profiles = dialog.message.chat_active.slice(0,4);
					this.photo_50 = dialog.message.photo_50;
			} else {
				this.peer_id = dialog.message.user_id;
				this.type = this.peer_id > 0 ? DialogType.User : DialogType.Group;
				this.profiles = [ dialog.message.user_id ]
			}

		}
	}
}
