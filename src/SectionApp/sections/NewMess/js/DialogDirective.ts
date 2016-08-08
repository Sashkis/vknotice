module SectionsApp {
	export function DialogDirective(storage: StorageApp.StorageService) {

		interface IDialogScope extends ng.IScope {
			dialog: IDialogWithProfiles,
		}

		interface IDialogWithProfiles extends IDialog {
			profiles: any,
		}

		function getProfile (profile: number|IProfile) {
			return typeof profile === 'object' ? profile : <IProfile>storage.getProfile(profile);
		};

		return {
			templateUrl: '/SectionApp/sections/NewMess/dialog.tpl',
			replace: true,
			link: function($scope: IDialogScope) {
        $scope.dialog.profiles = $scope.dialog.profiles.map(getProfile);
      }
		};
	}

	DialogDirective.$inject = [
		'storage',
	];
}
