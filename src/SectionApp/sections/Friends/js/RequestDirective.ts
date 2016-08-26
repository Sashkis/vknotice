module SectionsApp {
  interface IRequestScope extends ng.IScope {
    user: IProfile | {};
  }

  export function RequestDirective (storage: StorageApp.StorageService) {
  	return {
  		restrict: 'E',
  		replace: false,
  		templateUrl:'../SectionApp/sections/Friends/request.tpl',
  		scope: true,
  		link: function ($scope: IRequestScope, el: HTMLElement, attr: any) {
  			$scope.user = storage.getProfile(+attr.userId);
  		},
  	};
  }
  RequestDirective.$inject = ['storage']
}
