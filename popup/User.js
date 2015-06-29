function User (user_obj) {
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
	}, VK = 'https://vk.com/', param;

	/**
	 * Применяем свойства по-умолчанию
	 */
	user_obj = jQuery.extend(defaults, user_obj);
	for (param in user_obj) {
		this[param] = user_obj[param];
	}
	this.name = this.first_name + ' ' + this.last_name;

	this.profileLink = function (ancor, needOnlineMarker) {
		if(!ancor) ancor = this.name;
		if(needOnlineMarker === true && this.online === 1) var profileClass = 'profile online';
		else var profileClass = 'profile';
		return ancor.link(VK + this.domain, {class: profileClass});
	};


	this.ava = function (options) {
		options = jQuery.extend({
			'isLink': false,
			'size': 100
		}, options);
		var imgHTML = '<img class="ava" src="' + this.photo_100 + '" width="' + options.size + '" height="' + options.size + '"/>';
		if (options.isLink === true) return this.profileLink(imgHTML, true);
		else return imgHTML;
	}

	this.addOrDel = function (method, done, fail, always) {
		window.pop.callAPI('friends.' + method, {'user_id': this.id}, done, fail, always);
	}
}