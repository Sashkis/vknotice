/// <reference path="../all.d.ts"/>
module StorageApp {
// eslint-disable-next-line angular/no-service-method
	angular.module('StorageApp', [])
		.constant('DefaultStorage', {
			access_token: '',
			user_id: 0,
			options: {
				friends: true,
				photos: true,
				videos: true,
				messages: true,
				groups: true,
				notifications: true,
				comments: true,
				audio: 1,
			},
			counter: {},
			currentSection: '',
			friends: [],
			newfriends: [],
			dialogs: [],
			groups: [],
			users: [],
			profiles: [],
			lang: 0,
			notifyLast_viewed: Date.now()/1000,
		})
		.service('storage', StorageService);
}
