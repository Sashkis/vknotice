module PopupApp {
	export function vkHrefDirective() {

		return {
			link: function($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) {
				/**
				 * Важный костыль! Позволяет подменить ссылку.
				 * Это нужно для того, чтобы иметь в наличии ссылку,
				 * которая будет одновременно обрабатыватся плагином UI-Router,
				 * и иметь в атрибуте href адрес полноценного сайта, который можно открыть в новой вкладке.
				 */
				setTimeout(() => element.attr('href', attrs.vkHref), 50); // Значение '50' взято от балды.
      }
		};
	}
}
