angular.module('SectionsApp')
	.factory('stack', function () {
		let items = [];

		return {
			add: (item) => items.push(item),
			delete: () => items.pop(),
			get: () => items[items.length-1],
		}
	});