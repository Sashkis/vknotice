angular.module('SectionsApp')
    .factory('stack', function () {
    var items = [];
    return {
        add: function (item) { return items.push(item); },
        delete: function () { return items.pop(); },
        get: function () { return items[items.length - 1]; },
    };
});
//# sourceMappingURL=StackFactory.js.map