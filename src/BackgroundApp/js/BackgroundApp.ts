/// <reference path="../../all.d.ts"/>
/// <reference path="BgClass.ts"/>
module BgApp {

	angular.module('BgApp', ['DeamonApp', 'angular-google-analytics', 'gettext'])

	.constant('Config', {
		profilesLimit: 100,
	})

	.run(Helpers.setCurrentLanguage)
	.config(Helpers.setAnaliticSetting)
	.run(Helpers.trackPage)
	.controller('Bg', BgClass);
}
