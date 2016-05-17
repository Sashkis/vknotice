angular.module('PopupApp', ['PopupHeaderApp', 'PopupSidebarApp'])
.config(function () {
	console.log("PopupApp config");
})
.run(function ($rootScope) {
	console.log("PopupApp run");
// 	chrome.storage.local.get(function(stg) {
// 		// The $apply is only necessary to execute the function inside Angular scope
// 		$rootScope.$apply(function() {
// 			$rootScope.stg = stg;
// 		});
// 	});

// 	chrome.storage.onChanged.addListener(function (changes) {
// 		angular.forEach(changes, function (values, key) {
// 			$rootScope.stg[key] = values.newValue;
// 		});
// 		$rootScope.$apply();
// 	});
});