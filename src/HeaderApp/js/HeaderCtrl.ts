/// <reference path="../../all.d.ts"/>
module HeaderApp {
	export class HeaderCtrl {
		public static $inject = [
			'storage',
			'Analytics',
			'$httpParamSerializer',
			'gettextCatalog',
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
			$httpParamSerializer: ng.IHttpParamSerializer,
			gettextCatalog: any
		) {
			this.optionUrl = chrome.extension.getURL('OptionsApp/index.html');

			this.shareUrl = 'https://vk.com/share.php?' + $httpParamSerializer({
				'url'         : 'http://vk.com/note45421694_12011424',
				'title'       : gettextCatalog.getString('Информер Вконтакте'),
				'description' : gettextCatalog.getString('Отображает количество непрочитанных сообщений и позволяет ответить не заходя в ВК!'),
				'image'       : 'https://pp.vk.me/c628716/v628716694/2c20c/f3gq0pcaqHI.jpg',
				'noparse'     : 'true',
			});

			this.reviewUrl = /(opera|opr|Yandex|YaBrowser)/i.test(navigator.userAgent)
				? 'https://addons.opera.com/extensions/details/app_id/ephejldckfopeihjfhfajiflkjkjbnin#feedback-container'
				: 'https://chrome.google.com/webstore/detail/jlokilojbcmfijbgbioojlnhejhnikhn/reviews';

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
			});
		}

		trackActivity (activity: string) {
			this.Analytics.trackEvent('Activity', activity, 'dropdown-menu');
		}

	}
}
