/// <reference path="../../all.d.ts" />

module OptionsApp {
	angular.module('OptionsApp', ['HeaderApp', 'gettext', 'angular-google-analytics'])
		.config(Helpers.setAnaliticSetting)
		.run(Helpers.setCurrentLanguage)
		.run(Helpers.trackPage)
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
		})
		.filter('kFilter', function () {
				return function (input: any, decimals: any) {
					const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];

					if(isNaN(input)) return null;
					if(input < 1000) return input;

					const exp = Math.floor(Math.log(input) / Math.log(1000));

					return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
				};
			});
}
