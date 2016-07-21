module SectionsApp {
	export class Message implements IMessage {
		id: number;
		body: string;
		user_id: number;
		from_id: number;
		date: Date;
		read_state: number;
		out: number;

		constructor(message: IMessage) {
			angular.extend(<IMessage>this, message);
			// const emoji = new Emoji();
			// this.body = $filter('linky')(this.body);
			// console.log(this, new Emoji());
		}
	}
}
