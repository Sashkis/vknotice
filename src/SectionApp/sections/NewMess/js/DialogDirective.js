var SectionsApp;
(function (SectionsApp) {
    function DialogDirective(storage) {
        return {
            templateUrl: '/SectionApp/sections/NewMess/dialog.tpl',
            compile: function () {
                return {
                    pre: function (scope) {
                        console.log(scope);
                        scope.dialog.profile = storage.getProfile(scope.dialog.id);
                    }
                };
            }
        };
    }
    SectionsApp.DialogDirective = DialogDirective;
    DialogDirective.$inject = [
        'storage',
    ];
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=DialogDirective.js.map