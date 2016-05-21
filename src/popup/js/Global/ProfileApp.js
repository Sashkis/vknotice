function Profile( data ) {
	if (!data.name && (data.first_name || data.last_name)) {
		data.name = data.first_name+' '+data.last_name;
	}
	angular.extend(this, data);
}

Profile.prototype = {
	update: function() {
		// Обновляем (В реальном коде :P)
		this.name = "Dave";
		this.country = "Canada";
	}
};

Profile.getById = function( id ) {
	return new Profile(this.src.profiles[id]);
};

Profile.setSrc = function( src ) {
	this.src = src;
};

Profile.create = function( data ) {
	return new Profile(data);
};

// Наша фабрика
angular.module('ProfileApp', [])

.factory('profileService', function() {
	return {
		getById: Profile.getById,
		setSrc: Profile.setSrc,
		create: Profile.create,
	};
});