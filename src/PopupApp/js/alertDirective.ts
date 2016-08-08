module PopupApp {
	interface IAlertScope extends ng.IScope {
		alert: IAlert;
		close: ($event: ng.IAngularEvent) => void;
	}
	export function alertDirective() {
		return {
			templateUrl: '/PopupApp/alert.tpl',
			replace: true,
			scope: {
				alert: '='
			},
			controller: ['$scope', function ($scope: IAlertScope) {
				$scope.close = function ($event: ng.IAngularEvent) {
					$event.preventDefault();
					$scope.$emit('onAlertClick', $scope.alert, false);
				}
			}]
		}
	}
}
