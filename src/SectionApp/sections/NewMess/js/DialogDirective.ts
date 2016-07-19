module SectionsApp {
	export function DialogDirective(storage: StorageApp.StorageService) {
		// dialogs: IDialog_cached[];

		// public static $inject = [
		// 	'storage',
		// ];

		// constructor(private storage: StorageApp.StorageService) {
		// 	// storage.ready.then((stg) => {
		// 		// this.dialogs = angular.copy(stg.dialogs_cache);
		// 	// });
		// }
		return {
			templateUrl: '/SectionApp/sections/NewMess/dialog.tpl',
			compile: () => {
				return {
					pre: (scope:any) => {
						console.log(scope);
						scope.dialog.profile = storage.getProfile(scope.dialog.id);
					}
				}
			}
		};

		// link(scope) {
		// 	console.log(scope);
		// }
	}
	DialogDirective.$inject = [
		'storage',
	];
}
