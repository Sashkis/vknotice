angular.module('VkApp')

.constant('Config', {
	apiVersion: '5.52',
})

.factory('$vk', ['$q','$http','$httpParamSerializer', 'storage', 'Config', function ($q, $http,$httpParamSerializer, storage, Config) {
	return {
		authUrl: 'https://oauth.vk.com/authorize?' + $httpParamSerializer({
			'redirect_uri'	: 'https://oauth.vk.com/blank.html',
			'client_id'		: 4682781,
			'scope'			: 'offline,friends,messages,notifications,wall',
			'response_type'	: 'token',
			'display'		: 'popup',
			'v'				: Config.apiVersion,
			'state'			: 'vknotice'
		}),

		isAuth: function () {
			return this.stg.access_token && this.stg.user_id;
		},

		auth: function () {
			var ready = $q.defer();
			var $vk = this;
			storage.ready.then(function (stg) {
				$vk.stg = stg;

				if ( $vk.isAuth() ) {
					ready.resolve($vk);
				} else {
					chrome.tabs.create({url: $vk.authUrl, active: true}, function (tab) {
						const authTabId = tab.id;
						chrome.tabs.onUpdated.addListener(function tabUpdateListener (tabId, changeInfo) {
							if(tabId === authTabId
								&& changeInfo.url !== undefined
								&& changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1
							) {
								let authData = $vk.parseHashParams(changeInfo.url);
								$vk.stg.access_token = authData.access_token;
								$vk.stg.user_id = authData.user_id;

								storage.set({
									user_id: $vk.stg.user_id,
									access_token: $vk.stg.access_token,
								});

								chrome.tabs.remove(authTabId);
								chrome.tabs.onUpdated.removeListener(tabUpdateListener);
							}
						});
						chrome.tabs.onRemoved.addListener(function tabRemovedListener (tabId, removeInfo) {
							if (authTabId === tabId) {
								if ( $vk.isAuth() ) {
									ready.resolve($vk);
								} else {
									ready.reject($vk);
								}
								chrome.tabs.onRemoved.removeListener(tabRemovedListener);
							}

						});
					});
				}

			});

			return ready.promise;
		},

		parseHashParams: function (url) {
			const ret = {};

			const hash = url.split('#')[1].split('&');
			for (let i = hash.length; i--;) {
				if (!hash[i]) continue;

				let s = hash[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		},

		api: function (method, data) {
			var ready = $q.defer();
			$http.get('https://api.vk.com/method/'+method, {params: data})
				.then(function (API) {
					if (API.data.response !== undefined) {
						ready.resolve(API.data.response);
					} else {
						ready.reject('api_error');
					}
				}, function () {
					ready.reject('connect_error');
				});

			return ready.promise;
		}
	}
}]);