angular.module('PopupApp', ['HeaderApp', 'SectionsApp', 'gettext', 'angular-google-analytics'])
    .config(['AnalyticsProvider', Helpers.setAnaliticSetting])
    .run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
    .run(['Analytics', 'storage', Helpers.trackPage]);
//# sourceMappingURL=PopupApp.js.map