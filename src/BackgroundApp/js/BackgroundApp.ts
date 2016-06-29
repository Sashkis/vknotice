/// <reference path="../../all.d.ts"/>
module BgApp {

	angular.module('BgApp', ['DeamonApp', 'angular-google-analytics'])

	.constant('Config', {
		profilesLimit: 100,
	})

	.config(['AnalyticsProvider', Helpers.setAnaliticSetting])
	.controller('Bg', BgClass);
}
