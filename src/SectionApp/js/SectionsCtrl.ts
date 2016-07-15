angular.module('SectionsApp')

	.controller('SectionsCtrl', ['stack', 'storage', 'Analytics', 'SectionsNames',
	function (stack, storage, Analytics, SectionsNames) {
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
		});
	}]);
