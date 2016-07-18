var SectionsApp;
(function (SectionsApp) {
    var Dialog = (function () {
        function Dialog(dialog) {
            this.message = [];
            this.in_read = dialog.in_read;
            this.out_read = dialog.out_read;
            if (angular.isArray(dialog.message)) {
                this.message = angular.copy(dialog.message);
            }
            else if (angular.isObject(dialog.message)) {
                this.message.push(dialog.message);
            }
        }
        return Dialog;
    }());
    SectionsApp.Dialog = Dialog;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=Dialog.class.js.map