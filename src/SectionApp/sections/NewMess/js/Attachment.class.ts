module SectionsApp {
	export class Attachment {
		type: string;

		constructor(attach: IAttachment) {
			this.type = attach.type;
		}
	}
}
