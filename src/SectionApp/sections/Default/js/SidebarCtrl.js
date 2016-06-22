angular.module('SectionsApp')
    .controller('SidebarCtrl', ['storage',
    function (storage) {
        var vm = this;
        storage.ready.then(function (stg) {
            vm.stg = stg;
        });
    },
]);
//# sourceMappingURL=SidebarCtrl.js.map