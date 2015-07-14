String.prototype.escapeHtml = function () {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return this.replace(/[&<>"']/g, function (m) { return map[m]; });
};

String.prototype.link = function (url, attr) {
	if (!url) {
		url = 'http://vk.com/';
	}
	if (attr) {
		var attr_str = '', a;
		for (a in attr) {
			attr_str += a + '="' + attr[a] + '"';
		}
	} else var attr_str = '';
	return '<a href="' + url + '" target="_blank" ' + attr_str + '>' + this + '</a>';
};

String.prototype.icon = function (icon, attr) {
	if (attr) {
		var attr_str = '', a;
		for (a in attr) {
			if (a === 'class') icon += ' ' + attr.class;
			else attr_str += (a + '="' + attr[a] + '"');
		}
	} else var attr_str = '';
	return '<i class="icon-' + icon + '" ' + attr_str + '></i>' + this;
};

Date.prototype.toStringVkFormat = function () {
	var now = new Date();
		ago = (now.getTime() - this.getTime())/1000; // Количество секунд прошедших с момента публикации
	if(ago < 10) return window.Popup.i18n.date.now;
	else if(ago < 60) return getCase(Math.floor(ago), window.Popup.i18n.date.seconds) + '&nbsp' + window.Popup.i18n.date.ago;
	else if(ago < 3600) return getCase(Math.floor(ago / 60), window.Popup.i18n.date.minutes) + '&nbsp' + window.Popup.i18n.date.ago
	else if(ago < 10800) return getCase(Math.floor(ago / 3600), window.Popup.i18n.date.hours) + '&nbsp' + window.Popup.i18n.date.ago
	else {
		var h = this.getHours() < 10 ? '0' + this.getHours() : this.getHours(),
			m = this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes();
		if (ago < 86400) {
			return window.Popup.i18n.date.today + '&nbsp' + window.Popup.i18n.date.at + '&nbsp' + h + ':' + m;
		} else if (ago < 172800) {
			return window.Popup.i18n.date.tomorrow + '&nbsp' + window.Popup.i18n.date.at + '&nbsp' + h + ':' + m;
		} else {
			var y = this.getFullYear() != now.getFullYear() ? '&nbsp' + this.getFullYear() : '';
			return this.getDate() + '&nbsp' + window.Popup.i18n.date.months[this.getMonth()] + y + '&nbsp' + window.Popup.i18n.date.at + '&nbsp' + h + ':' + m;
		}
	}
};

/**
 * Возвращает правильный падеж фразы
 * @param  array t массив фраз
 * @param  int	n число
 * @return strind  строка вида "5 сообщений"
 */
function getCase (number, words) {
	return number!=0? number + '&nbsp' + words[number%10==1&&number%100!=11?0:number%10>=2&&number%10<=4&&(number%100<10||number%100>=20)?1:2] : "";
};