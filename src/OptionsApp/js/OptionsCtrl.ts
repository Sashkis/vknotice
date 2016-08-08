/// <reference path="../../all.d.ts"/>
module OptionsApp {

	interface IOptionScope extends ng.IScope {
		saveOptions: () => void,
		isOptionSaved: () => boolean,
	}

	export class OptionsCtrl {
		stg = <IStorageData>{};
		options: IOptions;

		public static $inject = [
			'storage',
			'$scope',
			'Analytics',
			'gettextCatalog',
		];

		constructor (
			private storage: StorageApp.StorageService,
			private $scope: IOptionScope,
			private Analytics: any,
			private gettextCatalog: any
		) {
			storage.ready.then((stg) => {
				this.stg = stg;
				this.options = angular.copy(stg.options);
			});

			VK.Widgets.Group("vk_groups", {
				redesign: 1,
				mode: 2,
				height: document.getElementById('vk_groups').offsetHeight,
				width: 'auto'
			}, 90041499);
		}

		saveOptions () {
			console.log(this);
			this.Analytics.trackEvent('Activity', 'SaveOptions');
			this.storage.set({
				options: this.options,
			}, true, () => this.$scope.$apply() );
		};

		isOptionNotSaved () {
			return !angular.equals(this.options, this.stg.options);
		};

		clearData () {
			if (confirm(this.gettextCatalog.getString('Данное действие удалит весь кэш и сбросит настройки.\nВы уверены, что хотите сделать это?'))) {
				this.Analytics.trackEvent('Activity', 'ClearData');
				this.storage.clear(() => chrome.runtime.reload());
			}
		};

	}
}
