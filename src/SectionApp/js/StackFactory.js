angular.module('SectionsApp')
	.factory('stack', function () {
		let items = [];

		return {
			add: (item) => items.push(item),
			get: () => items.pop(),
			cur: () => items[items.length-1],
		}
	});