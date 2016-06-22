angular.module('DeamonApp')

.factory('deamon', ['$vk', '$log', '$timeout', function ($vk, $log, $timeout) {
	let defaultMethod = '';
	let defaultDoneCallback = function () {};
	let defaultFailCallback = function () {};
	let isDeamonStarted = false;
	let requestInterval = 2000;

	function deamonStart(method, params, doneCallback, failCallback) {
		defaultMethod = method || defaultMethod;
		defaultDoneCallback = doneCallback || defaultDoneCallback;
		defaultFailCallback = failCallback || defaultFailCallback;

		isDeamonStarted = true;
		$log.info('Deamon Start');
		request(params);
	}

	function deamonStop() {
		isDeamonStarted = false;
		$log.info('Deamon Stop');
	}

	function request(params) {
		$vk.api(defaultMethod, params).then(function (response) {
			let isContinue = defaultDoneCallback(response);

			restartRequest(isContinue, params);
		}, function (err) {
			let isContinue = defaultFailCallback(err);

			restartRequest(isContinue, params);
		});
	}

	function restartRequest(isContinue, params) {
		if (isDeamonStarted && isContinue) {
			$timeout(() => {
				request(params);
			}, requestInterval);
		} else {
			deamonStop();
		}
	}

	return {
		start: deamonStart,
		stop: deamonStop,
		set_requestInterval: function (interval) {
			requestInterval = interval;
		},
	};

}]);
