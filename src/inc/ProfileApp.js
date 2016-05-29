// Наша фабрика
angular.module('ProfileApp', [])

.factory('profile', function() {
	return {
		getById: function (id) {
			if (this.stg && this.stg.profiles && angular.isArray(this.stg.profiles) && this.stg.profiles.length) {
				for (let i = this.stg.profiles.length - 1; i >= 0; i--) {
					if (this.stg.profiles[i] && this.stg.profiles[i].id == id) return this.stg.profiles[i];
				}
			}
			return {};
		},
		init: function (stgSrc) {
			this.stg = stgSrc;
		},
	};
});
