module VkApp {
	export class VkService {
		authUrl: string;
		stg = <IStorageData>{};

		public static $inject = [
			'$q',
			'$http',
			'storage',
			'apiConfig',
			'authConfig',
			'$log',
			'$httpParamSerializer',
		];

		constructor (
			private $q: ng.IQService,
			private $http: ng.IHttpService,
			private storage: StorageApp.StorageService,
			private apiConfig: { version: string },
			private authConfig: {},
			private $log: ng.ILogService,
			$httpParamSerializer: ng.IHttpParamSerializer
		) {
			this.authUrl = `https://oauth.vk.com/authorize?${$httpParamSerializer(authConfig)}`;
		}
		
		isAuth () {
			const ready = this.$q.defer<boolean>();

			if (this.stg.access_token && this.stg.user_id) {
				this.api('users.get', {access_token: this.stg.access_token}).then((resp) => {
					ready.resolve(resp && resp[0] && resp[0].id && resp[0].id == this.stg.user_id);
				}, () => {
					ready.resolve(false);
				});
			} else {
				ready.resolve(false);
			}

			return ready.promise;
		}

		private parseHashParams (url: string) : IVkAuth {
			const ret  = <IVkAuth>{};
			const hash = url.split('#')[1].split('&');

			for (let i = hash.length; i--;) {
				if (!hash[i]) continue;
				let s = hash[i].split('=');

				ret[s[0]] = s[1];
			}

			return ret;
		}

		private isAuthSuccess (authData = <any>{}) : authData is IVkAuthSuccess {
			return authData && authData.user_id
			                && authData.access_token
											&& authData.state
											&& authData.state === 'vknotice';
		}

		auth() {
			const ready = this.$q.defer<undefined>();

			this.storage.ready.then((stg: IStorageData) => {
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
							const tabUpdateListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
								if (authTabId && authTabId === tabId
									            && changeInfo.url
									            && changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1
								) {
									const authData = this.parseHashParams(changeInfo.url);

									if (!this.isAuthSuccess(authData)) return;

									this.storage.set({
										user_id:      authData.user_id,
										access_token: authData.access_token,
									});

									!!authTabId && chrome.tabs.remove(authTabId);
									chrome.tabs.onUpdated.removeListener(tabUpdateListener);
								}
							};
							const tabRemovedListener = (tabId: number) => {
								if (authTabId === tabId) {
									this.isAuth().then((isAuth) => {
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

		api (method: string, params = <IVkRequest>{}) {
			const ready = this.$q.defer();

			params.v = this.apiConfig.version;
			this.$http.get(`https://api.vk.com/method/${method}`, {params})
				.then((API: IVkResponse) => {
					if (this.isResponseSuccess(API.data)) {
						ready.resolve(API.data.response);
					} else {
						this.$log.error(API.data.error);
						ready.reject('api_error');
					}
				}, () => {
					ready.reject('connect_error');
				});

			return ready.promise;
		}

		private isResponseSuccess(respData: any) : respData is IVkResponseSuccess {
			return !!respData.response;
		}
	}
}
