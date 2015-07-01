function User (user_obj) {

	var param;
	if (typeof user_obj === 'number') {
		// if (!window.pop.profiles[user_obj]) {
		// 	console.warn('User not found ' + user_obj);
		// 	window.isLoad = false;
		// 	return window.pop.callAPI('users.get', {
		// 		user_ids: user_obj,
		// 		fields: 'status,photo_100,domain,online'
		// 	}, function (API) {
		// 		window.pop.profiles[user_obj] = new User(API[0]);
		// 		console.log(window.pop.profiles[user_obj]);
		// 		return window.pop.profiles[user_obj];
		// 	}, function (error) {
		// 		console.log(error);
		// 	});
		// 	var a = 0;
		// 	while(!window.pop.profiles[user_obj] && ++a < 15000) {
		// 		console.log(window.pop.profiles[user_obj]);
		// 		// wait
		// 	};
		// }

		if (window.pop.profiles[user_obj]) {
			for (param in window.pop.profiles[user_obj]) {
				this[param] = window.pop.profiles[user_obj][param];
			};
			return true;
		} else {
			user_obj = {};
		}
	}


	var defaults = {
		'id': 0,
		'domain': '',
		'first_name': '',
		'last_name': '',
		'online': 0,
		'online_app': 0,
		'online_mobile': 0,
		'photo_100': 'img/camera_100.png',
		'status': '',
	}, VK = 'https://vk.com/';

	/**
	 * Применяем свойства по-умолчанию
	 */
	user_obj = jQuery.extend(defaults, user_obj);
	for (param in user_obj) {
		this[param] = user_obj[param];
	}
	this.name = this.first_name + ' ' + this.last_name;

	this.profileLink = function (ancor, needOnlineMarker) {
		if (!ancor) ancor = this.name;
		if (needOnlineMarker === true && this.online === 1) var profileClass = 'profile online';
		else var profileClass = 'profile';
		return ancor.link(VK + this.domain, {class: profileClass});
	};

	this.ava = function (options) {
		options = jQuery.extend({
			'title': false,
			'isLink': false,
			'size': 100
		}, options);
		var imgHTML = '<img class="ava" title="' + (options.title ? this.name : '') + '" src="' + this.photo_100 + '" width="' + options.size + '" height="' + options.size + '"/>';
		if (options.isLink === true) return this.profileLink(imgHTML, true);
		else return imgHTML;
	}

	this.addOrDel = function (method, done, fail, always) {
		window.pop.callAPI('friends.' + method, {'user_id': this.id}, done, fail, always);
	}
}