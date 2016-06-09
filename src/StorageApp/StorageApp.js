// eslint-disable-next-line angular/no-service-method
angular.module('StorageApp', [])
	.service('storage', ['$q', '$rootScope', Storage]);
