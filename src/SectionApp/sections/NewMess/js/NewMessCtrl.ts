module SectionsApp {
	export class NewMessCtrl {

		public static $inject = [
			'$vk',
			'storage',
			'$stateParams'
		];

		stg: IStorageData;
		isOpenDialog: boolean;
		stateParams: ng.ui.IStateParamsService;

		constructor(private $vk: VkApp.VkService, private storage: StorageApp.StorageService, $stateParams: ng.ui.IStateParamsService) {
			storage.ready.then((stg) => this.stg = stg);
			this.stateParams = $stateParams;

			document.getElementById('dialogs-list').addEventListener("mousewheel", (e) => this.onMousewheel(e), false);;
		}

		markAsRead(peer_id: number) {
			this.$vk.auth().then(() => {
				this.$vk.api('messages.markAsRead', {
					access_token: this.$vk.stg.access_token,
					peer_id,
				});
			});
		}

		onMousewheel($event: WheelEvent) {
			const dialogsList = document.getElementById('dialogs-list');
			if (!dialogsList) return;

			const bottom = $event.deltaY > 0;
			const scroller = <HTMLElement>document.getElementsByClassName('scroller')[0];

			const topLimit = 0;
			const bottomLimit = -scroller.offsetHeight + dialogsList.offsetHeight;

			const currentScroll = parseInt(scroller.style.marginTop || '0');
			let scrollTo = currentScroll + (bottom ? -48 : 48);

			if (scrollTo <= bottomLimit) {
				scrollTo = bottomLimit;
				dialogsList.classList.remove('can-move-bottom');
			} else dialogsList.classList.add('can-move-bottom');

			if (scrollTo >= topLimit) {
				scrollTo = topLimit;
				dialogsList.classList.remove('can-move-top');
			} else dialogsList.classList.add('can-move-top');
			// $event.deltaY;
			// console.log(scrollTo, bottomLimit);
			scroller.style.marginTop = `${scrollTo}px`;
			// console.log($ ? 'Вниз' : "ВВерх");
		}
	}
}
