angular.module('SectionsApp')
    .controller('NewMessCtrl', ['storage',
    function (storage) {
        var vm = this;
        storage.ready.then(function (stg) {
            vm.stg = stg;
        });
    }]);
//# sourceMappingURL=NewMessCtrl.js.map