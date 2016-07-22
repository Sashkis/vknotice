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

		constructor(message: IMessage) {
			angular.extend(<IMessage>this, message);
			if (this.emoji) {
				this.body = new Emoji().emojiToHTML(this.body);
			}
		}
	}
}
