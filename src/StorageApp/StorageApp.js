var StorageApp;
(function (StorageApp) {
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
    })
        .service('storage', StorageApp.StorageService);
})(StorageApp || (StorageApp = {}));
//# sourceMappingURL=StorageApp.js.map