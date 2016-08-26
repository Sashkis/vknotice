var SectionsApp;
(function (SectionsApp) {
    function RequestDirective(storage) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '../SectionApp/sections/Friends/request.tpl',
            scope: true,
            link: function ($scope, el, attr) {
                $scope.user = storage.getProfile(+attr.userId);
            },
        };
    }
    SectionsApp.RequestDirective = RequestDirective;
    RequestDirective.$inject = ['storage'];
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=RequestDirective.js.map