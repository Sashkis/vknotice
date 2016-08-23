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
			'$httpParamSerializer',
		];

		constructor (
			private $q: ng.IQService,
			private $http: ng.IHttpService,
			private storage: StorageApp.StorageService,
			private apiConfig: { version: string },
			private authConfig: {},
			$httpParamSerializer: ng.IHttpParamSerializer
		) {
			this.authUrl = `https://oauth.vk.com/authorize?${$httpParamSerializer(authConfig)}`;
		}

		/**
		 * Асинхронно Проверяет авторизован ли пользователь
		 */
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

		/**
		 * Парсит ссылку страницы авторизации
		 * @param  {string}  url Ссылка страницы авторизации
		 * @return {IVkAuth}     Данние после авторизации
		 */
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

		/**
		 * Проверяет, что данные со страницы сожержат информациб об авторизованном пользователе
		 * @param  {IVkAuth}   authData     Данные со страницы авторизации
		 * @return {boolean}
		 */
		private isAuthSuccess (authData = <any>{}) : authData is IVkAuthSuccess {
			return authData && authData.user_id
			                && authData.access_token
			                && authData.state
			                && authData.state === 'vknotice';
		}

		/**
		 * Асинхронно авторизовавыет пользователя
		 */
		auth() {
			const ready = this.$q.defer<undefined>();

			this.storage.ready.then((stg: IStorageData) => {
				this.stg = stg;
				this.isAuth().then((isAuth: boolean) => {
					if (isAuth) {
						ready.resolve();
					} else {

						this.storage.set({
							user_id:      0,
							access_token: '',
						});

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
										user_id:      +authData.user_id,
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

		/**
		 * Выполняет асинхронный запрос к API
		 * @param  {string}     method                Метод API
		 * @param  {IVkRequest} params                Параметры API
		 */
		api (method: string, params = <IVkRequest>{}) {
			const ready = this.$q.defer();

			params.v = this.apiConfig.version;
			this.$http.get(`https://api.vk.com/method/${method}`, {
				params,
				timeout: 4000,
				cache: false,
			})
				.then((API: IVkResponse) => {
					if (this.isResponseSuccess(API.data)) {
						ready.resolve(API.data.response);
					} else {
						if (API.data.error && API.data.error.error_code === 6) {
							console.warn('Wait to restart');
							setTimeout(() => {
								console.warn('Restart');
								this.api(method, params).then(ready.resolve, ready.reject);
							}, 2000);
						} else {
							console.error(API.data.error);
							ready.reject('api_error');
						}
					}
				}, (e: any) => {
					console.error(e);
					ready.reject('connect_error');
				});

			return ready.promise;
		}

		/**
		 * Проверяет наличие поля с результатом выполнения метода
		 * @param  {object}      respData Ответ сервера
		 * @return {boolean}
		 */
		private isResponseSuccess(respData: any) : respData is IVkResponseSuccess {
			return angular.isDefined(respData.response);
		}
	}
}
