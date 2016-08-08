var PopupApp;
(function (PopupApp) {
    function alertDirective() {
        return {
            templateUrl: '/PopupApp/alert.tpl',
            replace: true,
            scope: {
                alert: '='
            },
            controller: ['$scope', function ($scope) {
                    $scope.close = function ($event) {
                        $event.preventDefault();
                        $scope.$emit('onAlertClick', $scope.alert, false);
                    };
                }]
        };
    }
    PopupApp.alertDirective = alertDirective;
})(PopupApp || (PopupApp = {}));
//# sourceMappingURL=alertDirective.js.map