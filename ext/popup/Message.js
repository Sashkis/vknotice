/**
 * Класс сообщения
 * @constructor
 * @param {Object} mess_obj Объект сообщения загруженный через API
 * @param {Dialog} parentDialog  Объект родительского диалога
 * @param {Message} parentMessage Объект родительского сообщения
 */
function Message (mess_obj, parentDialog, parentMessage) {
	var VK = 'https://vk.com/';
	$.extend(this, mess_obj)

	if (!!parentDialog) {
		this.url = parentDialog.url + '&msgid=' + this.id;
	}

	if (!!parentMessage) {
		this.url = parentMessage.url;
	}

	if (!!this.action) {
		this.body = '<span class="system">' + window.Popup.loc(this.action) + '</span>';
	} else if (this.body) {
		this.body = this.body.escapeHtml();
		if (this.emoji === 1) {
			this.body = window.Emoji.emojiToHTML(this.body);
		}
		this.body += ' ';
	}

	// Добавляем код карту во вложения
	if (!!this.geo) {
		if (this.attachments === undefined) {
			this.attachments = [];
		}
		this.attachments.push({
			type: 'geo',
			geo: this.geo
		});
		delete this.geo;
	}

	// Добавляем код вложений
	if (!!this.attachments) {
		this.attachments = this.attachments.map(function (attach) {
			if (typeof attach === 'string') {
				return attach;
			}
			var type = attach.type,
				attach = attach[type];
			switch(type) {
				// Изображение
				case 'photo':
					attach.url = '';
					if		(attach['photo_2560'])	attach.url = attach['photo_2560'];
					else if (attach['photo_1280'])	attach.url = attach['photo_1280'];
					else if (attach['photo_807'])	attach.url = attach['photo_807'];
					else if (attach['photo_604'])	attach.url = attach['photo_604'];
					else if (attach['photo_130'])	attach.url = attach['photo_130'];
					else if (attach['photo_75'])	attach.url = attach['photo_75'];
					else attach.url = this.url;
					return ('&nbsp;' + window.Popup.loc('Photo')).icon('camera').link(attach.url); 
				break;
				// Подарок
				case 'gift':
					attach.url = '';
					if		(attach['thumb_256'])	attach.url = attach['thumb_256'];
					else if (attach['thumb_96'])	attach.url = attach['thumb_96'];
					else if (attach['thumb_48'])	attach.url = attach['thumb_48'];
					else attach.url = this.url;
					return ('&nbsp;' + window.Popup.loc('Gift')).icon('gift').link(attach.url); 
				break;
				// Пост
				case 'wall' : return ('&nbsp;' + window.Popup.loc('Post')).icon('pencil').link(VK + 'wall' + attach.from_id + '_' + attach.id); break;
				// Комментарий
				case 'wall_reply' : return ('&nbsp;' + window.Popup.loc('Comment')).icon('chat').link(VK + 'wall' + attach.owner_id + '_' + attach.post_id + '?reply=' + attach.id); break;
				// Аудиозапись
				case 'audio': return ('&nbsp;' + attach.artist.bold() + '&nbsp;–&nbsp;' + attach.title).icon('music').link(VK + 'audio' + attach.owner_id + '_' + attach.id); break;
				// Видеозапись
				case 'video': return ('&nbsp;' + attach.title).icon('video').link(VK + 'video' + attach.owner_id + '_' + attach.id); break;
				// Документ
				case 'doc'	: return ('&nbsp;' + attach.title).icon('doc').link(attach.url); break;
				// Ссылка
				case 'link'	: return ('&nbsp;' + attach.title).icon('link').link(attach.url); break;
				// Карта
				case 'geo':
					attach.coordinates = attach.coordinates.split(' ');
					attach.coordinates = (attach.coordinates[0]-0) + ',' + (attach.coordinates[1]-0);
					return ('&nbsp;' + (attach.place ? attach.place.title : window.Popup.loc('Map'))).icon('location').link('https://www.google.com.ua/maps/place/@' + attach.coordinates + ',13z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0');
				break;
				// Стикеры
				case 'sticker': 
					return '<img class="emoji sticker" src="' + this.attachments[i].sticker.photo_64 + '" height="32">';
				break;
				
				// Неподдерживаемое вложение
				default	 : return ('&nbsp;' + window.Popup.loc('Attachment')).icon('attach').link(this.url);
			}
		});
		this.body += ' <span class="attachments">' + this.attachments.join(' ') + '</span>';
	}

	if (this.fwd_messages) {
		var fwd_text = '';
		if (parentMessage !== undefined) {
			fwd_text = getCase(this.fwd_messages.length, window.Popup.loc('forwarded messages')).icon('chat').link(this.url);
		} else {
			for (var i = 0; i < this.fwd_messages.length; i++) {
				this.fwd_messages[i] = new Message(this.fwd_messages[i], parentDialog, this);
				if ((this.fwd_messages[i-1] != undefined && this.fwd_messages[i-1].user_id == this.fwd_messages[i].user_id)) {
					fwd_text += this.fwd_messages[i].getHtml();
				} else {
					fwd_text += this.fwd_messages[i].getHtml('compact');
				}
			};
		}
		this.body += ' <div class="fwd">' + fwd_text + '</div>';
	}

	/**
	 * Возвращает сгенерированный код сообщения
	 * @param  {String} type Формат сообщения
	 * @return {String}      HTML code
	 */
	this.getHtml = function (type) {
		var messHtml = '';
		switch(type) {
			case 'compact':
				messHtml += '<div class="compact">' + new User(this.from_id || this.user_id).ava({size:25, title: true, marker: false}) + '</div>';
			default : 
				return messHtml += '<message class="short"><span class="body">' + this.body + '</span></message> ';
		}
	};
}