module SectionsApp {
	export class SectionsCtrl {
		public static $inject = [
			'storage',
			'Analytics',
			'$location',
			'$window',
			'$scope',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private Analytics: any,
			private $location: ng.ILocationService,
			private $window: ng.IWindowService,
			$scope: ng.IScope
		) {
			storage.ready.then((stg) => {
				Analytics.set('&uid', stg.user_id);

				if (stg.currentSection !== '/') {
					$location.url(stg.currentSection);
				}
			});

			$scope.$on('$locationChangeStart', () => this.saveSection())
		}

		isNoRoot() {
			return this.$location.url() !== '/';
		}

		saveSection() {
			this.storage.set({
				currentSection: this.$location.url()
			});
		}
	}
}
