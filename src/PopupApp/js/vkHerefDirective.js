var PopupApp;
(function (PopupApp) {
    function vkHrefDirective() {
        return {
            link: function ($scope, element, attrs) {
                setTimeout(function () { return element.attr('href', attrs.vkHref); }, 50);
            }
        };
    }
    PopupApp.vkHrefDirective = vkHrefDirective;
})(PopupApp || (PopupApp = {}));
//# sourceMappingURL=vkHerefDirective.js.map