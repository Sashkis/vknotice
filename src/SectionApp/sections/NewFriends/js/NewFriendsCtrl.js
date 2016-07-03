angular.module('SectionsApp')
    .controller('NewFriendsCtrl', ['storage', '$vk',
    function (storage, $vk) {
        var vm = this;
        vm.mark = function ($event, type, user_id) {
            $event.preventDefault();
            var method = false;
            switch (type) {
                case 'add':
                    method = 'friends.add';
                    break;
                case 'ban':
                    method = 'account.banUser';
                    break;
                case 'delete':
                    method = 'friends.delete';
                    break;
                case 'deleteAll':
                    method = 'friends.deleteAllRequests';
                    break;
            }
            if (method) {
                $vk.auth().then(function () {
                    $vk.api(method, {
                        user_id: user_id,
                        access_token: $vk.stg.access_token,
                    }).then(function () {
                    });
                });
            }
        };
        storage.ready.then(function (stg) {
            vm.stg = stg;
        });
    },
])
    .directive('request', ['storage', function (storage) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '../SectionApp/sections/NewFriends/request.tpl',
            scope: true,
            link: function ($scope, el, attr) {
                $scope.user = storage.getProfile(+attr.userId);
            },
        };
    }]);
//# sourceMappingURL=NewFriendsCtrl.js.map