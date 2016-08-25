var VkApp;
(function (VkApp) {
    var API_VERSION = '5.53';
    angular.module('VkApp', ['StorageApp', 'ngToast'])
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
        .config(['ngToastProvider', function (ngToastProvider) {
            ngToastProvider.configure({
                animation: 'slide',
                horizontalPosition: 'center',
                maxNumber: 2,
                newestOnTop: false,
            });
        }])
        .service('$vk', VkApp.VkService);
})(VkApp || (VkApp = {}));
//# sourceMappingURL=VkApp.js.map