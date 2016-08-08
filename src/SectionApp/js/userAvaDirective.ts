module SectionsApp {
	export function userAvaDirective(storage: StorageApp.StorageService) {

		interface IAvaScope extends ng.IScope {
			profileId?: number,
			src?: string,
		}

		function getProfile (profile: number|IProfile) : IProfile {
			return typeof profile === 'object' ? profile : <IProfile>storage.getProfile(profile);
		};

		return {
			template: '<img class="ava" ng-src="{{src}}">',
			// replace: true,
			scope: {
        profileId:'=?',
        src:'=?',
      },
			link: function($scope: IAvaScope) {
				if (!$scope.src && $scope.profileId) {
					const profile = getProfile($scope.profileId);
					if (profile.photo_50) $scope.src = profile.photo_50;
				}
      }
		};
	}

	userAvaDirective.$inject = [
		'storage',
	];
}
