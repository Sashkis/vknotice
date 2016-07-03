angular.module('SectionsApp')

	.controller('SidebarCtrl', ['storage',
		function (storage) {
			const vm = this;

			storage.ready.then(function (stg) {
				vm.stg = stg;
			});
		},
	]);
