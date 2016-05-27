angular.module('DeamonApp')

.provider('deamon', [function () {
	var defaultMethod = '';
	var defaultDoneCallback = function () {};
	var defaultFailCallback = function () {};

	var requestInterval = 2000;
	var isDeamonStarted = false;
	var isContinue = function () {
		return true;
	};


	return {

		set_requestInterval: function (interval) {
			requestInterval = interval;
		},

		set_isContinue_function: function (func) {
			isContinue = func;
		},

		$get: ['$vk', function () {
			function deamonStart (method, params, doneCallback, failCallback) {
				defaultMethod = method || defaultMethod;
				defaultDoneCallback = doneCallback || defaultDoneCallback;
				defaultFailCallback = failCallback || defaultFailCallback;

				isDeamonStarted = true;

				request(params);
			}

			function deamonStop (timeOut, params) {
				isDeamonStarted = false;
				// if (timeOut) {
				// 	setTimeout(deamonStart, timeOut);
				// }
			}

			function request(params) {
				console.log(params);
				// $vk.api(defaultMethod, params).then(function (response) {
				// 	defaultDoneCallback(response);
				// 	if (isDeamonStarted && isContinue()) {
				// 		setTimeout(() => {
				// 			request(params);
				// 		}, requestInterval);
				// 	} else {
				// 		deamonStop();
				// 	}
				// });
			}
			return {
				start: deamonStart,
				stop: deamonStop,
			}
		}]
	};

}]);
