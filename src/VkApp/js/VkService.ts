// angular.module('VkApp')
//
// .constant('apiConfig', {
// 	version: '5.52',
// })
//
// .factory('$vk', ['$q', '$http', '$httpParamSerializer', 'storage', 'apiConfig', '$log',
//
module VkApp {
	export class VkService {
		authUrl: string;
		stg: IStorageData;

		public static $inject = [
			'$q',
			'$http',
			'$httpParamSerializer',
			'storage',
			'apiConfig',
			'authConfig',
			'$log',
		];

		constructor (
			private $q: ng.IQService,
			private $http: ng.IHttpService,
			private $httpParamSerializer: ng.IHttpParamSerializer,
			private storage: StorageApp.StorageService,
			private apiConfig: { version: string },
			private authConfig: {},
			private $log: ng.ILogService
		) {
			this.authUrl = 'https://oauth.vk.com/authorize?' + $httpParamSerializer(authConfig);
		}

		isAuth () {
			const $vk   = this;
			const ready = this.$q.defer();

			if ($vk.stg.access_token && $vk.stg.user_id) {
				$vk.api('users.get', {access_token: $vk.stg.access_token}).then(function (resp) {
					ready.resolve(resp && resp[0] && resp[0].id && resp[0].id == $vk.stg.user_id);
				}, function () {
					ready.resolve(false);
				});
			} else {
				ready.resolve(false);
			}

			return ready.promise;
		}

		parseHashParams (url: string) : {
			user_id: string,
			access_token: string,
			state: 'vknotice',
		} | {
			error: string
			error_description: string,
		} {
			const ret  = {};
			const hash = url.split('#')[1].split('&');

			for (let i = hash.length; i--;) {
				if (!hash[i]) continue;
				let s = hash[i].split('=');

				ret[s[0]] = s[1];
			}

			return ret;
		}

		auth() {
			const ready = this.$q.defer();

			this.storage.ready.then((stg: IStorageData) => {
				console.log(this);
				this.stg = stg;
				this.isAuth().then((isAuth: boolean) => {
					if (isAuth) {
						ready.resolve();
					} else {
						chrome.tabs.create({
							url:    this.authUrl,
							active: true,
						}, (tab) => {
							const authTabId = tab.id;
							const tabUpdateListener = (tabId: number, changeInfo: {url: string}) => {
								if (tabId === authTabId
									&& changeInfo.url
									&& changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1
								) {
									let authData = this.parseHashParams(changeInfo.url);

									this.stg.user_id      = authData.user_id;
									this.stg.access_token = authData.access_token;

									this.storage.set({
										user_id:      this.stg.user_id,
										access_token: this.stg.access_token,
									});

									authTabId && chrome.tabs.remove(authTabId);
									chrome.tabs.onUpdated.removeListener(tabUpdateListener);
								}
							};
							const tabRemovedListener = (tabId: number) => {
								if (authTabId === tabId) {
									this.isAuth().then(function (isAuth) {
										ready[ isAuth ? 'resolve' : 'reject' ]();
										chrome.tabs.onRemoved.removeListener(tabRemovedListener);
									});
								}
							}

							chrome.tabs.onUpdated.addListener(tabUpdateListener);
							chrome.tabs.onRemoved.addListener(tabRemovedListener);
						});
					}
				});
			});

			return ready.promise;
		}

		api (method: string, data = {}) {
			const ready = this.$q.defer();

			data.v = this.apiConfig.version;
			this.$http.get('https://api.vk.com/method/'+method, {params: data})
				.then(function (API) {
					if (API.data && API.data.response) {
						ready.resolve(API.data.response);
					} else if (API.data.error) {
						this.$log.error(API.data.error);
						ready.reject('api_error');
					}
				}, function () {
					ready.reject('connect_error');
				});

			return ready.promise;
		}
	}
}
//
// function ($q, $http, $httpParamSerializer, storage, apiConfig, $log) {
// 	return {
// 		authUrl:          'https://oauth.vk.com/authorize?' + $httpParamSerializer({
// 			'redirect_uri':  'https://oauth.vk.com/blank.html',
// 			'client_id':     4682781,
// 			'scope':         'offline,friends,messages,notifications,wall',
// 			'response_type': 'token',
// 			'display':       'popup',
// 			'v':             apiConfig.version,
// 			'state':         'vknotice',
// 		}),
//
//
// 		isAuth: function () {
// 			const $vk   = this;
// 			const ready = $q.defer();
//
// 			if ($vk.stg.access_token && $vk.stg.user_id) {
// 				$vk.api('users.get', {access_token: $vk.stg.access_token}).then(function (resp) {
// 					ready.resolve(resp && resp[0] && resp[0].id && resp[0].id == $vk.stg.user_id);
// 				}, function () {
// 					ready.resolve(false);
// 				});
// 			} else {
// 				ready.resolve(false);
// 			}
//
// 			return ready.promise;
// 		},
//
		// auth: function () {
		// 	const $vk   = this;
		// 	const ready = $q.defer();
		//
		// 	storage.ready.then(function (stg) {
		// 		$vk.stg = stg;
		// 		$vk.isAuth().then(function (isAuth) {
		// 			if (isAuth) {
		// 				ready.resolve();
		// 			} else {
		// 				chrome.tabs.create({
		// 					url:    $vk.authUrl,
		// 					active: true,
		// 				}, function (tab) {
		// 					const authTabId = tab.id;
		//
		// 					chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo) {
		// 						if (tabId === authTabId
		// 							&& angular.isDefined(changeInfo.url)
		// 							&& changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1
		// 						) {
		// 							let authData = $vk.parseHashParams(changeInfo.url);
		//
		// 							$vk.stg.user_id      = authData.user_id;
		// 							$vk.stg.access_token = authData.access_token;
		//
		// 							storage.set({
		// 								user_id:      $vk.stg.user_id,
		// 								access_token: $vk.stg.access_token,
		// 							});
		//
		// 							chrome.tabs.remove(authTabId);
		// 							chrome.tabs.onUpdated.removeListener(tabUpdateListener);
		// 						}
		// 					});
		// 					chrome.tabs.onRemoved.addListener(function tabRemovedListener(tabId) {
		// 						if (authTabId === tabId) {
		// 							$vk.isAuth().then(function (isAuth) {
		// 								ready[ isAuth ? 'resolve' : 'reject' ]();
		// 								chrome.tabs.onRemoved.removeListener(tabRemovedListener);
		// 							});
		// 						}
		// 					});
		// 				});
		// 			}
		// 		});
		// 	});
		//
		// 	return ready.promise;
		// },
//
// 		parseHashParams: function (url) {
// 			const ret  = {};
// 			const hash = url.split('#')[1].split('&');
//
// 			for (let i = hash.length; i--;) {
// 				if (!hash[i]) continue;
// 				let s = hash[i].split('=');
//
// 				ret[s[0]] = s[1];
// 			}
//
// 			return ret;
// 		},
//
// 		api: function (method, data) {
// 			const ready = $q.defer();
//
// 			data.v = apiConfig.version;
// 			$http.get('https://api.vk.com/method/'+method, {params: data})
// 				.then(function (API) {
// 					if (angular.isDefined(API.data.response)) {
// 						ready.resolve(API.data.response);
// 					} else {
// 						$log.error(API.data.error);
// 						ready.reject('api_error');
// 					}
// 				}, function () {
// 					ready.reject('connect_error');
// 				});
//
// 			return ready.promise;
// 		},
// 	};
// }]);
