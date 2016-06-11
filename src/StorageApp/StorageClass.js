/**
 * @ngdoc class Storage
 * @description Класс для загрузки и сохранения информации в память Chrome
 * @prop {Promise} ready
 * @prop {object}  $rootScope
 * @prop {object}  stg                       - Объект содержащий информацию загруженную из памяти Chrome.
 * @prop {string}  stg.access_token          - Ключ доступа к аккаунту.
 * @prop {string}  stg.user_id               - ID авторизированного пользователя.
 * @prop {object}  stg.options               - Объект содержащий настройки расширения.
 * @prop {boolean} stg.options.friends       - Опция для включения уведомления.
 * @prop {boolean} stg.options.photos        - Опция для включения уведомления.
 * @prop {boolean} stg.options.videos        - Опция для включения уведомления.
 * @prop {boolean} stg.options.messages      - Опция для включения уведомления.
 * @prop {boolean} stg.options.groups        - Опция для включения уведомления.
 * @prop {boolean} stg.options.notifications - Опция для включения уведомления.
 * @prop {boolean} stg.options.comments      - Опция для включения уведомления.
 * @prop {string}  stg.options.audio         - Опция для включения звука при получении нового уведомления.
 *                                             0 - Звук выключен.
 *                                             1 - Звук включен, если закрыты все вкладки *.vk.com
 *                                             2 - Звук включен всегда
 * @prop {object}  stg.alerts                - Всплывающие уведомления.
 * @prop {array}   stg.alerts.message        - Массив уведомлений в очереди.
 * @prop {object}  stg.alerts.error          - Уведомление об ошибке или ссылка на авторизацию.
 * @prop {object}  stg.counter               - Текущие счетчики.
 * @prop {strind}  stg.currentSection        - ID последней открытой секции.
 * @prop {array}   stg.friends               - Массив последних загруженных друзей, которые были online.
 * @prop {array}   stg.newfriends            - Массив последних загруженных заявок в друзья.
 * @prop {array}   stg.dialogs               - Массив последних загруженных диалогов.
 * @prop {array}   stg.groups                - Массив объектов последних загруженных групп.
 * @prop {array}   stg.users                 - Массив объектов последних загруженных пользователей.
 * @prop {array}   stg.profiles              - Кэшированный массив всех извесных пользователей и групп.
 * @prop {array}   stg.lang                  - Установленный язык пользователя.
 * @prop {number}  stg.lastOpenComment       - Timestamp последнего визита на страницу vk.com/feed?section=comments.
 */
 // eslint-disable-next-line no-unused-vars
class Storage {
	constructor($q, $rootScope) {
		const Promise = new $q.defer();

		this.$rootScope = $rootScope;
		this.ready = Promise.promise;
		this.stg = {};

		chrome.storage.local.get((stg) => {
			this.stg = angular.copy(stg);

			$rootScope.$apply();
			Promise.resolve(this.stg);
		});
	}

	onChanged(callback) {
		chrome.storage.onChanged.addListener((changes) => {
			callback(changes, this.stg);
			this.$rootScope.$apply();
		});
	}

	set(data, callback) {
		angular.extend(this.stg, angular.copy(data) );
		chrome.storage.local.set(data, callback);
	}

	getProfileIndex(id) {
		if (!id
			|| angular.isUndefined(this.stg)
			|| angular.isUndefined(this.stg.profiles)
			|| !angular.isArray(this.stg.profiles)
		) return -1;
		for (let i = 0; i < this.stg.profiles.length; i++) {
			// Нельзя проводить сравнение по типу,
			// так как id может быть передан в качестве строки
			if (this.stg.profiles[i].id == id) return i;
		}

		return -1;
	}

	getProfile(id) {
		const index = this.getProfileIndex(id);

		return index >= 0 ? this.stg.profiles[index] : {};
	}

	setProfiles(array) {
		if (!angular.isArray(array)) return;
		array.map((profile) => {
			if (!profile || angular.isUndefined(profile.id)) return;
			const index = this.getProfileIndex(profile.id);

			if (angular.isUndefined(this.stg.profiles)) this.stg.profiles = [];

			if (index >= 0) {
				this.stg.profiles[index] = profile;
			} else {
				this.stg.profiles.unshift(profile);
			}
		});
	}

	clearProfiles(limit) {
		if (limit === 0) return this.stg.profiles = [];

		this.stg.profiles = this.stg.profiles.filter((profile) => profile && profile.id);
		if (this.stg.profiles.length > limit) return this.stg.profiles = this.stg.profiles.slice(0, limit);

		return this.stg.profiles;
	}
}
