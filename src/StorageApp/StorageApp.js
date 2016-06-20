var StorageApp;
(function (StorageApp) {
    angular.module('StorageApp', [])
        .service('storage', ['$q', '$rootScope', StorageApp.StorageService]);
})(StorageApp || (StorageApp = {}));
//# sourceMappingURL=StorageApp.js.map