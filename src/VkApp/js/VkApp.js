var VkApp;
(function (VkApp) {
    const API_VERSION = '5.52';
    angular.module('VkApp', ['StorageApp'])
        .constant('apiConfig', {
        version: API_VERSION,
    })
        .constant('authConfig', {
        'redirect_uri': 'https://oauth.vk.com/blank.html',
        'client_id': 4682781,
        'scope': 'offline,friends,messages,notifications,wall',
        'response_type': 'token',
        'display': 'popup',
        'v': API_VERSION,
        'state': 'vknotice',
    })
        .service('$vk', VkApp.VkService);
})(VkApp || (VkApp = {}));
//# sourceMappingURL=VkApp.js.map