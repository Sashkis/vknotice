/// <reference path="../all.d.ts"/>
module StorageApp {
	const DefaultStorage: IStorageData = {
		access_token: '',
		user_id: 0,
		options: {
			friends: true,
			photos: true,
			videos: true,
			messages: true,
			groups: true,
			wall: true,
			mentions: true,
			comments: false,
			likes: false,
			reposts: false,
			followers: false,
			audio: 1,
		},
		counter: [],
		currentSection: '',
		friends: [],
		newfriends: [],
		dialogs: [],
		groups: [],
		users: [],
		profiles: [],
		lang: 0,
		notifyLast_viewed: Date.now()/1000,
		state: {
			name: 'home',
			params: {},
		},
		alerts: []
	};
	angular.module('StorageApp', [])
		.constant('DefaultStorage', DefaultStorage)
		.service('storage', StorageService);
}
