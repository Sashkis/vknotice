module OptionsApp {
	angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
		.config(['AnalyticsProvider', Helpers.setAnaliticSetting])
		.run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
		.run(['Analytics', 'storage', Helpers.trackPage])
		.controller('OptionsCtrl', OptionsCtrl)
		.directive('option', () => new OptionsDirective);
}
