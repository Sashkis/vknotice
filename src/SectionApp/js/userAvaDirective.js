var SectionsApp;
(function (SectionsApp) {
    function userAvaDirective(storage) {
        function getProfile(profile) {
            return typeof profile === 'object' ? profile : storage.getProfile(profile);
        }
        ;
        return {
            template: '<img class="ava" ng-src="{{src}}">',
            scope: {
                profileId: '=?',
                src: '=?',
            },
            link: function ($scope) {
                if (!$scope.src && $scope.profileId) {
                    var profile = getProfile($scope.profileId);
                    if (profile.photo_50)
                        $scope.src = profile.photo_50;
                }
            }
        };
    }
    SectionsApp.userAvaDirective = userAvaDirective;
    userAvaDirective.$inject = [
        'storage',
    ];
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=userAvaDirective.js.map