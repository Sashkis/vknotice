/**
 * Екранирует HTML
 * @return {String} Преобразованная строка
 */
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

/**
 * Превращает текст в ссылку
 * @param  {String} url  
 * @param  {Object} attr
 * @return {String}      HTML
 */
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

/**
 * Добавлает к строке HTML код иконки
 * @param  {String} icon 
 * @param  {Object} attr 
 * @return {String}       HTML
 */
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

/**
 * Формат даты Вконтакте
 * @return {String}
 */
Date.prototype.toStringVkFormat = function () {
	var now = new Date(),
		ago = (now.getTime() - this.getTime())/1000; // Количество секунд прошедших с момента публикации
	if(ago < 10) return window.Popup.loc('just now', true);
	else if(ago < 60) return getCase(Math.floor(ago), window.Popup.loc('seconds', true)) + '&nbsp' + window.Popup.loc('ago', true);
	else if(ago < 3600) return getCase(Math.floor(ago / 60), window.Popup.loc('minutes', true)) + '&nbsp' + window.Popup.loc('ago', true)
	else if(ago < 10800) return getCase(Math.floor(ago / 3600), window.Popup.loc('hours', true)) + '&nbsp' + window.Popup.loc('ago', true)
	else {
		var h = this.getHours() < 10 ? '0' + this.getHours() : this.getHours(),
			m = this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes();
		if (ago < 86400) {
			return window.Popup.loc('today', true) + '&nbsp' + window.Popup.loc('at', true) + '&nbsp' + h + ':' + m;
		} else if (ago < 172800) {
			return window.Popup.loc('tomorrow', true) + '&nbsp' + window.Popup.loc('at', true) + '&nbsp' + h + ':' + m;
		} else {
			var y = this.getFullYear() != now.getFullYear() ? '&nbsp' + this.getFullYear() : '';
			return this.getDate() + '&nbsp' + window.Popup.loc('months', true)[this.getMonth()] + y + '&nbsp' + window.Popup.loc('at', true) + '&nbsp' + h + ':' + m;
		}
	}
};

/**
 * Возвращает правильный падеж фразы
 * @param  {Array}	t массив фраз
 * @param  {Number}	n число
 * @example
 * getCase(5, [слово, слова, слов]); // "5 слов"
 * @return {String}   строка
 */
function getCase (number, words) {
	return number!=0? number + '&nbsp' + words[number%10==1&&number%100!=11?0:number%10>=2&&number%10<=4&&(number%100<10||number%100>=20)?1:2] : "";
};

$('.dropdown').on('click', function(){
	$(this).toggleClass('open');
});