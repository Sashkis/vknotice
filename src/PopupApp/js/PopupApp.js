angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
    .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
    .run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage]);
//# sourceMappingURL=PopupApp.js.map