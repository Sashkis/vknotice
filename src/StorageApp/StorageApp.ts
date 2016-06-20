/// <reference path="../_all.d.ts"/>
module StorageApp {
// eslint-disable-next-line angular/no-service-method
	angular.module('StorageApp', [])
		.service('storage', ['$q', '$rootScope', StorageService]);
}
