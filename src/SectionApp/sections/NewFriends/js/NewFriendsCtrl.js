angular.module('SectionsApp')
	.controller('NewFriendsCtrl', [
		'storage',
		'$vk',
		function (storage, $vk) {
			$this = this;

			$this.mark = function ($event, type, user_id) {
				$event.preventDefault();
				var method = false;
				switch (type) {
					case 'add' : method = 'friends.add'; break;
					case 'ban' : method = 'account.banUser'; break;
					case 'delete' : method = 'friends.delete'; break;
					case 'deleteAll' : method = 'friends.deleteAllRequests'; break;
				}

				if (method) {
					$vk.auth().then(function () {
						$vk.api(method, {
							user_id: user_id,
							access_token: $vk.stg.access_token,
						}).then(function (resp) {
							// Сделать что-то когда заявка обработана
						});
					});
				}
			}

			storage.ready.then(function (stg) {
				$this.stg = stg;
			});

		}
	])

	.directive('request', ['profile', function(profile) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl:'../SectionApp/sections/NewFriends/request.tpl',
			scope: true,
			link: function ($scope, el, attr) {
				$scope.user = profile.getById(attr.userId);
	        }
		};
	}]);
