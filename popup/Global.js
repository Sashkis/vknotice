String.prototype.escapeHtml = function () {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return this.replace(/[&<>"']/g, function (m) { return map[m]; });
}

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
}

String.prototype.icon = function (icon, attr) {
	if (attr) {
		var attr_str = '', a;
		for (a in attr) {
			if (a === 'class') icon += ' ' + attr.class;
			else attr_str += (a + '="' + attr[a] + '"');
		}
	} else var attr_str = '';
	return '<i class="icon-' + icon + '" ' + attr_str + '></i>' + this;
}

/**
 * Возвращает правильный падеж фразы
 * @param  array t массив фраз
 * @param  int 	 n число
 * @return strind  строка вида "5 сообщений"
 */
function getCase (t, n) {
	return n!=0? n + '&nbsp' + t[n%10==1&&n%100!=11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2] :"";
};