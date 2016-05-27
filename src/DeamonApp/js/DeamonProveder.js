angular.module('DeamonApp')

.provider('deamon', [function () {
	var defaultMethod = '';
	var defaultDoneCallback = function () {};
	var defaultFailCallback = function () {};

	var requestInterval = 2000;
	var isDeamonStarted = false;

	return {

		set_requestInterval: function (interval) {
			requestInterval = interval;
		},


		$get: ['$vk', function ($vk) {
			function deamonStart (method, params, doneCallback, failCallback) {
				defaultMethod = method || defaultMethod;
				defaultDoneCallback = doneCallback || defaultDoneCallback;
				defaultFailCallback = failCallback || defaultFailCallback;

				isDeamonStarted = true;

				request(params);
			}

			function deamonStop (timeOut, params) {
				isDeamonStarted = false;
			}

			function request(params) {
				$vk.api(defaultMethod, params).then(function (response) {
					var isContinue = defaultDoneCallback(response);
					if (isDeamonStarted && isContinue) {
						setTimeout(() => {
							request(params);
						}, requestInterval);
					} else {
						deamonStop();
					}
				},
				defaultFailCallback);
			}
			return {
				start: deamonStart,
				stop: deamonStop,
			}
		}]
	};

}]);
