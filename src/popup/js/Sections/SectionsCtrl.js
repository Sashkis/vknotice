angular.module('SectionsApp')

	.controller('SectionsCtrl', ['sections', 'stack', function (sections, stack) {
		const $this = this;
		$this.sections = sections;
		$this.stack = stack;

		$this.openSection = openSection;
		$this.backSection = backSection;

		function openSection (section_id) {
			if ($this.sections[section_id]) {
				if ($this.sections[section_id] !== $this.stack.cur()) {
					$this.stack.add($this.sections[section_id]);
				} else {
					$this.backSection();
				}
			}
		}

		function backSection () {
			$this.stack.get();
		}
	}]);