module SectionsApp {
	export class Message implements IMessage {
		id: number;
		body: string;
		user_id: number;
		from_id: number;
		date: number;
		read_state: number;
		out: number;
		emoji: number;
		fwd_messages: IMessage[];
		attachments: IAttachment[];

		constructor(message: IMessage) {
			angular.extend(<IMessage>this, message);

			if (angular.isArray(this.fwd_messages)) {
				if (!this.attachments) this.attachments = [];
				console.log(this);
				this.attachments.push({
					type: 'fwd_messages',
					fwd_messages: {
						items: this.fwd_messages
					}
				});
				delete this.fwd_messages;
			}
		}
	}
}
