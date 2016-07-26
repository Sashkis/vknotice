module SectionsApp {
	export function userNameDirective(storage: StorageApp.StorageService) {

		interface INameScope extends ng.IScope {
			profileId: number,
			profile: IProfile,
		}

		function getProfile (profile: number|IProfile) {
			return typeof profile === 'object' ? profile : <IProfile>storage.getProfile(profile);
		};

		return {
			template: '{{profile.name || profile.first_name+" "+profile.last_name}}',
			// replace: true,
			scope: {
        profileId:'=',
      },
			link: function($scope: INameScope) {
				$scope.profile = getProfile($scope.profileId);
				console.log($scope.profile);
      }
		};
	}

	DialogDirective.$inject = [
		'storage',
	];
}
