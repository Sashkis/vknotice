function User (user_obj) {

	var param;
	if (typeof user_obj === 'number') {
		if (window.pop.profiles[user_obj]) {
			for (param in window.pop.profiles[user_obj]) {
				this[param] = window.pop.profiles[user_obj][param];
			};
			return true;
		} else {
			console.warn('User not loaded: ' + user_obj);
			window.pop.callAPI('users.get', {
				user_ids: user_obj,
				fields: 'status,photo_100,domain,online'
			}, function (API) {
				window.pop.profiles[user_obj.id] = new User(API[0]);
			});
			user_obj = {
				notLoaded: true,
				id: user_obj,
				domain: 'id'+user_obj
			};
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
		if (param === 'status') {
			this[param] = user_obj.status.escapeHtml();
		} else {
			this[param] = user_obj[param];
		}
	}

	this.name = function () {
		this.upData();
		return this.first_name + ' ' + this.last_name;
	};

	this.profileLink = function (ancor, needOnlineMarker) {
		this.upData();
		if (!ancor) ancor = this.name();
		if (needOnlineMarker === true && this.online === 1) var profileClass = 'profile online';
		else var profileClass = 'profile';
		return ancor.link(VK + this.domain, {class: profileClass});
	};

	this.ava = function (options) {
		this.upData();
		options = jQuery.extend({
			'title': false,
			'isLink': false,
			'size': 100
		}, options);
		var imgHTML = '<img class="ava" title="' + (options.title ? this.name() : '') + '" src="' + this.photo_100 + '" width="' + options.size + '" height="' + options.size + '"/>';
		if (options.isLink === true) return this.profileLink(imgHTML, true);
		else return imgHTML;
	};

	this.addOrDel = function (method, done, fail, always) {
		this.upData();
		window.pop.callAPI('friends.' + method, {'user_id': this.id}, done, fail, always);
	};

	this.upData = function () {
		if (this.notLoaded && window.pop.profiles[this.id]) {
			for (param in window.pop.profiles[this.id]) {
				this[param] = window.pop.profiles[this.id][param];
			};
			this.notLoaded = false;
		}
	};
}