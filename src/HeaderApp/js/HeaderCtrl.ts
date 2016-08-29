/// <reference path="../../all.d.ts"/>
module HeaderApp {
	export class HeaderCtrl {
		public static $inject = [
			'storage',
			'Analytics',
			'$state',
		];

		isDropdownOpen: boolean;
		stg: IStorageData;
		current_user: IProfile;
		shareUrl: string;
		optionUrl: string;
		reviewUrl: string;

		constructor (
			private storage: StorageApp.StorageService,
			private Analytics: any,
			private $state: ng.ui.IStateService,
		) {

			this.shareUrl = Helpers.getShareUrl();
			this.reviewUrl = Helpers.getReviewUrl();

			storage.ready.then((stg) => {
				this.stg = stg;
				this.current_user = <IProfile>storage.getProfile(stg.user_id);
			});
		}

		logout ($event: ng.IAngularEvent) {
			$event.preventDefault();
			this.storage.set({
				user_id: 0,
				access_token: '',
			}, true, () => {
				this.Analytics.trackEvent('OAuth', 'logout');
				chrome.browserAction.setBadgeText({text: ''});
			});
		}

		trackActivity (activity: string) {
			this.Analytics.trackEvent('Activity', activity, 'dropdown-menu');
		}

		isHome() {
			const isHome = this.$state.is('home');
			return isHome === undefined ? true : isHome;
		}

		openOptionsPage() {
			chrome.runtime.openOptionsPage();
		}

		back() {
			// const old = location.href;

			// if (window.history.length > 1) {
				window.history.back();
				// window.history.length--;
			// }
			// else this.$state.go('home');
		}

	}
}
