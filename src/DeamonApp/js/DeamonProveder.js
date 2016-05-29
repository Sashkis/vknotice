angular.module('DeamonApp')

.provider('deamon', [function () {
	var defaultMethod = '';
	var defaultDoneCallback = function () {};
	var defaultFailCallback = function () {};

	var requestInterval = 2000;
	var isDeamonStarted = false;

	return {



		$get: ['$vk','$log','$timeout', function ($vk, $log, $timeout) {
			function deamonStart (method, params, doneCallback, failCallback) {
				defaultMethod = method || defaultMethod;
				defaultDoneCallback = doneCallback || defaultDoneCallback;
				defaultFailCallback = failCallback || defaultFailCallback;

				isDeamonStarted = true;
				$log.info('Deamon Start');
				request(params);
			}

			function deamonStop () {
				isDeamonStarted = false;
				$log.info('Deamon Stop');
			}

			function request(params) {
				$vk.api(defaultMethod, params).then(function (response) {
					var isContinue = defaultDoneCallback(response);
					restartRequest(isContinue, params);
				},
				function (err) {
					var isContinue = defaultFailCallback(err);
					restartRequest(isContinue, params);
				});
			}

			function restartRequest (isContinue, params) {
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
		}],
	};

}]);
