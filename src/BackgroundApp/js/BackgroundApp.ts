/// <reference path="../../all.d.ts"/>
module BgApp {

	angular.module('BgApp', ['DeamonApp', 'angular-google-analytics'])

	.constant('Config', {
		profilesLimit: 100,
	})


	.config(['AnalyticsProvider', function (AnalyticsProvider: any) {

		AnalyticsProvider.setAccount({
			tracker: 'UA-71609511-3',
			trackEvent: true,
			fields: {
				cookieName: 'vknotice-analitics',
				cookieDomain: 'none',
			},
			set: {
				forceSSL: true,
			},
		})
		.setHybridMobileSupport(true);
	}])

	.controller('Bg', BgClass);
}
