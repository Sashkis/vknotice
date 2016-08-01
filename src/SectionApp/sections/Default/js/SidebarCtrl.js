var SectionsApp;
(function (SectionsApp) {
    var SidebarCtrl = (function () {
        function SidebarCtrl(storage) {
            var _this = this;
            storage.ready.then(function (stg) {
                _this.stg = stg;
            });
        }
        SidebarCtrl.$inject = [
            'storage',
        ];
        return SidebarCtrl;
    }());
    SectionsApp.SidebarCtrl = SidebarCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=SidebarCtrl.js.map