angular.module('OptionsApp')
	.controller('OptionsCtrl', ['storage', '$log', '$scope', function (storage, $log, $scope) {
		const vm = this;

		vm.options = {};
		vm.optionCach = {};
		vm.isOptionSaved = true;
		storage.ready.then((stg) => {
			const optArr = stg.apiOptions.options.split(',');

			$log.log(stg);
			optArr.map((opt) => {
				if (opt)
					vm.options[opt] = true;
			});

			vm.options.comments = !!stg.apiOptions.isLoadComments;
			vm.options.audio = !!stg.audio;

			vm.optionCach = vm.options;
		});

		vm.saveOptions = function () {
			let notifyOptions = [];
			let commentOptions = 0;
			let audioOptions = 0;

			angular.forEach(vm.options, (value, opt) => {
				if (opt === 'audio')
					audioOptions = value+0;
				else if (opt === 'comments')
					commentOptions = value+0;
				else if (value && opt) notifyOptions.push(opt);

			});

			storage.set({
				audio: audioOptions,
				apiOptions: {
					isLoadComments: commentOptions,
					options: notifyOptions.join(','),
				},
			}, () => {
				vm.isOptionSaved = true;
				$scope.$apply();
			});

		};

	}]);
