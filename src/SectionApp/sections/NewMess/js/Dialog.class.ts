module SectionsApp {
	export class Dialog implements IDialog {
		id: number;
		message: IMessage[] = [];
		in_read: number;
		out_read: number;
		constructor(dialog: IDialog) {
			this.in_read = dialog.in_read;
			this.out_read = dialog.out_read;

			if ( angular.isArray(dialog.message) ) {
				this.message = <IMessage[]>angular.copy(dialog.message);
			} else if( angular.isObject(dialog.message) ) {
				this.message.push(<IMessage>dialog.message);
			}

		}
	}
}
