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
				console.log(stg.currentSection);
				if (stg.currentSection !== '/') {
					$location.url(stg.currentSection);
				}
			});

				$scope.$on('$locationChangeSuccess', () => this.saveSection())
		}

		isRoot() {
			return this.$location.url() === '/';
		}

		back() {
			if (this.$window.history.length > 1)
				this.$window.history.back();
			else
				this.$location.url('/');
		}

		saveSection() {
			this.storage.set({
				currentSection: this.$location.url()
			});
		}
	}
}
// angular.module('SectionsApp')
//
// 	.controller('SectionsCtrl', ['stack', 'storage', 'Analytics', 'SectionsNames',
// 	function (stack, storage, Analytics, SectionsNames) {
	// 	const vm = this;
	//
	// 	vm.stack          = stack;
	// 	vm.openSection    = openSection;
	// 	vm.backSection    = backSection;
	// 	vm.currentSection = 'Default';
	//
	// 	function openSection(section_id, $event) {
	// 		angular.isDefined($event) && $event.preventDefault();
	// 		if (section_id !== vm.currentSection) {
	// 			vm.stack.add(section_id);
	// 			vm.currentSection = section_id;
	//
	// 			storage.set({currentSection: vm.currentSection});
	// 			Helpers.trackPage(Analytics, storage);
	// 		} else {
	// 			vm.backSection($event);
	// 		}
	// 	}
	//
	// 	function backSection($event) {
	// 		angular.isDefined($event) && $event.preventDefault();
	// 		vm.stack.delete();
	// 		vm.currentSection = vm.stack.get();
	//
	// 		if (!vm.currentSection) {
	// 			vm.currentSection = 'Default';
	// 		}
	// 		storage.set({currentSection: vm.currentSection});
	// 		Helpers.trackPage(Analytics, storage);
	// 	}
	//
	// 	storage.ready.then(function (stg) {
	// 		if (stg.currentSection) {
	// 			openSection(stg.currentSection);
	// 		}
		// });
	// }]);
