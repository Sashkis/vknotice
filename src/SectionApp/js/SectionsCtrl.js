angular.module('SectionsApp')

	.controller('SectionsCtrl', ['stack', 'storage', function (stack, storage) {
		const $this = this;
		$this.stack = stack;

		$this.openSection = openSection;
		$this.backSection = backSection;
		$this.currentSection = 'Default';

		function openSection (section_id, $event) {
			if ($event !== undefined) $event.preventDefault();
			if (section_id !== $this.currentSection) {
				$this.stack.add(section_id);
				$this.currentSection = section_id;

				storage.set({currentSection: $this.currentSection});
			} else {
				$this.backSection();
			}
		}

		function backSection ($event) {
			if ($event !== undefined) $event.preventDefault();
			$this.stack.delete();
			$this.currentSection = $this.stack.get();

			if (!$this.currentSection) {
				$this.currentSection = 'Default';
			}

			storage.set({currentSection: $this.currentSection});
		}

		storage.ready.then(function (stg) {
			if (stg.currentSection) {
				openSection(stg.currentSection);
			}
		});
	}]);