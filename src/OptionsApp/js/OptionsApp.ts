module OptionsApp {
	angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
		.config(['AnalyticsProvider', Helpers.setAnaliticSetting])
		.run(['gettextCatalog', 'storage', Helpers.setCurrentLanguage])
		.run(['Analytics', 'storage', Helpers.trackPage])
		.controller('OptionsCtrl', OptionsCtrl)
		.directive('checkboxOption', () => {
			return {
				template: `<input ng-model="param" type="checkbox"/>
									 <span class="fa-stack">
										<i class="fa fa-square fa-stack-2x"></i>
										<i ng-if="param" class="fa fa-check fa-stack-1x fa-inverse"></i>
									 </span>`,
				scope: {
					param: '=?'
				}
			}
		});
}
