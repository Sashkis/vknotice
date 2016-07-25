module SectionsApp {
	export function DialogDirective(storage: StorageApp.StorageService) {

		function getProfile (profile: number|IProfile) {
			return typeof profile === 'object' ? profile : storage.getProfile(profile);
		};

		return {
			templateUrl: '/SectionApp/sections/NewMess/dialog.tpl',
			replace: true,
			link: function($scope: ng.IScope) {
        $scope.dialog.profiles = $scope.dialog.profiles.map(getProfile);
      }
			// compile: () => {
			// 	return {
			// 		pre: (scope:any) => {
			// 			scope.dialog.profiles = scope.dialog.profiles.map(getProfile);
			// 			// console.log(scope.dialog);
			// 		}
			// 	}
			// }
		};
	}

	DialogDirective.$inject = [
		'storage',
	];
}
