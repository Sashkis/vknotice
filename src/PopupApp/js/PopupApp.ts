angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
	.config(['AnalyticsProvider', Helpers.setAnaliticSetting])
	.run(['gettextCatalog', 'storage', 'Analytics', Helpers.setCurrentLanguage]);
