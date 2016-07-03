angular.module('SectionsApp')
.controller('NewMessCtrl', ['storage',
function (storage) {
	const vm = this;

	storage.ready.then(function (stg) {
		vm.stg = stg;
	});
}]);
