angular.module('SectionsApp')
    .controller('SectionsCtrl', ['stack', 'storage', 'Analytics', 'SectionsNames',
    function (stack, storage, Analytics, SectionsNames) {
        var vm = this;
        vm.stack = stack;
        vm.openSection = openSection;
        vm.backSection = backSection;
        vm.currentSection = 'Default';
        function openSection(section_id, $event) {
            angular.isDefined($event) && $event.preventDefault();
            if (section_id !== vm.currentSection) {
                vm.stack.add(section_id);
                vm.currentSection = section_id;
                Analytics.trackPage('/' + vm.currentSection, (SectionsNames[vm.currentSection] || vm.currentSection));
                storage.set({ currentSection: vm.currentSection });
            }
            else {
                vm.backSection($event);
            }
        }
        function backSection($event) {
            angular.isDefined($event) && $event.preventDefault();
            vm.stack.delete();
            vm.currentSection = vm.stack.get();
            if (!vm.currentSection) {
                vm.currentSection = 'Default';
            }
            Analytics.trackPage('/' + vm.currentSection, (SectionsNames[vm.currentSection] || vm.currentSection));
            storage.set({ currentSection: vm.currentSection });
        }
        storage.ready.then(function (stg) {
            if (stg.currentSection) {
                openSection(stg.currentSection);
            }
        });
    }]);
//# sourceMappingURL=SectionsCtrl.js.map