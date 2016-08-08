module PopupApp {
	export class ContainerCtrl {
		public static $inject = [
			'$scope',
			'$vk',
			'storage',
			'Analytics',
		];

		stg: IStorageData;

		constructor($scope: ng.IScope, private $vk: VkApp.VkService, private storage: StorageApp.StorageService, private Analytics: any) {
			storage.ready.then(stg => {
				this.stg = stg

				Analytics.set('&uid', stg.user_id);

				this.deleteAlert();
			});

			$scope.$on('onAlertClick', ($event: ng.IAngularEvent, alert: IAlert, isOpened: boolean) => this.onAlertClick(alert, isOpened));

		}

		auth() {
			this.Analytics.trackEvent('OAuth', 'login');
			chrome.runtime.reload();
		}

		onAlertClick(alert: IAlert, isOpened: boolean) {
			this.deleteAlert(true);
			this.Analytics.trackEvent('Alert', isOpened ? 'open' : 'ignore', alert.id);
		}

		deleteAlert (isForse?: boolean) {
			if (isForse) delete this.stg.alerts[0];
			else if (!this.stg.alerts[0]) this.stg.alerts.shift();

			this.storage.set({
				alerts: this.stg.alerts
			});
		}
	}
}
