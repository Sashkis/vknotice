angular.module('SectionsApp')

	.controller('SectionsCtrl', ['sections', 'stack', '$rootScope', function (sections, stack, $rootScope) {
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
				// $this.$apply();
				// $apply();
			}
		}

		function backSection () {
			$this.stack.get();
				// $rootScope.$apply();
				// $this.$apply();
		}
	}]);