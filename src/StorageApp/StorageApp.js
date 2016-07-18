var StorageApp;
(function (StorageApp) {
    var DefaultStorage = {
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
            comments: true,
            likes: true,
            reposts: true,
            followers: true,
            audio: 1,
        },
        counter: [],
        currentSection: '',
        friends: [],
        newfriends: [],
        dialogs: [],
        dialogs_cache: [],
        groups: [],
        users: [],
        profiles: [],
        lang: 0,
        notifyLast_viewed: Date.now() / 1000,
    };
    angular.module('StorageApp', [])
        .constant('DefaultStorage', DefaultStorage)
        .service('storage', StorageApp.StorageService);
})(StorageApp || (StorageApp = {}));
//# sourceMappingURL=StorageApp.js.map