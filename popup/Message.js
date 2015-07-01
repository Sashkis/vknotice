function Message (mess_obj, parentDialog, parentMessage) {
	var VK = 'https://vk.com/', param;
	for (param in mess_obj) {
		this[param] = mess_obj[param];
	};

	if(parentDialog) {
		this.parentDialog = parentDialog;
		this.url = parentDialog.url + '&msgid=' + this.id;
	}

	if(parentMessage) {
		this.parentMessage = parentMessage;
		this.url = parentMessage.url;
	}

	if(this.action) {
		this.body = '<span class="system">'+window.pop.geti18n('attr.'+this.action)+'</span>';
	} else if (this.body) {
		this.body = this.body.escapeHtml();
		
		// Делаем ссылки кликабельными
		this.body = this.body.replace(/((https?:\/\/)?([A-Za-z-_0-9]+(\.[A-Za-z-_0-9]+)+)(\/[^\s]*)*)/g, function (url) {
			if(url.length > 30) {
				var ancor = url.substr(0,13)+'...'+url.substr(url.length-13)
			} else {
				var ancor = url;
			}

			if (url.search(/https?:\/\//) == -1) {
				return ancor.link('http://'+url);
			} else {
				return ancor.link(url);
			}
		});
		if (/^[A-Za-zА-Яа-яЁёЇїЄєҐґ0-9]$/.test(this.body.charAt(this.body.length - 1))) {
			this.body += '.';
		}
		this.body = window.Emoji.emojiToHTML(this.body);
		this.body += ' ';
	}

	// Добавляем код карту во вложения
	if (this.geo) {
		if (this.attachments === undefined) {
			this.attachments = [];
		}
		this.attachments.push({
			type: 'geo',
			geo:  this.geo
		});
		delete this.geo;
	}

	// Добавляем код вложений
	if (this.attachments) {
		for (var i = this.attachments.length; i--;) {
			if(typeof this.attachments[i] === 'string' ) continue;
			
			var type = this.attachments[i].type,
				attach = this.attachments[i][type];
			switch(type) {
				// Изображение
				case 'photo': 
					var photo_url = '';
					if 		(attach['photo_2560']!== undefined) photo_url = attach['photo_2560'];
					else if (attach['photo_1280']!== undefined) photo_url = attach['photo_1280'];
					else if (attach['photo_807'] !== undefined) photo_url = attach['photo_807'];
					else if (attach['photo_604'] !== undefined) photo_url = attach['photo_604'];
					else if (attach['photo_130'] !== undefined) photo_url = attach['photo_130'];
					else if (attach['photo_75']  !== undefined) photo_url = attach['photo_75'];
					else photo_url = this.url;
					this.attachments[i] = ('&nbsp;' + window.pop.geti18n('attr.photo')).icon('camera').link(photo_url); 
				break;
				// Подарок
				case 'gift': 
					var thumb_url = '';
					if 		(attach['thumb_256']!== undefined) thumb_url = attach['thumb_256'];
					else if (attach['thumb_96'] !== undefined) thumb_url = attach['thumb_96'];
					else if (attach['thumb_48'] !== undefined) thumb_url = attach['thumb_48'];
					else thumb_url = this.url;
					this.attachments[i] = ('&nbsp;' + window.pop.geti18n('attr.gift')).icon('gift').link(thumb_url); 
				break;
				// Пост
				case 'wall' : this.attachments[i] = ('&nbsp;' + window.pop.geti18n('attr.post')).icon('pencil').link(VK + 'wall' + attach.from_id + '_' + attach.id); break;
				// Комментарий
				case 'wall_reply' : this.attachments[i] = ('&nbsp;' + window.pop.geti18n('attr.wall_reply')).icon('chat').link(VK + 'wall' + attach.owner_id + '_' + attach.post_id + '?reply=' + attach.id); break;
				// Аудиозапись
				case 'audio': this.attachments[i] = ('&nbsp;' + attach.artist.bold() + '&nbsp;–&nbsp;' + attach.title).icon('music').link(VK + 'audio' + attach.owner_id + '_' + attach.id); break;
				// Видеозапись
				case 'video': this.attachments[i] = ('&nbsp;' + attach.title).icon('video').link(VK + 'video' + attach.owner_id + '_' + attach.id); break;
				// Документ
				case 'doc'	: this.attachments[i] = ('&nbsp;' + attach.title).icon('doc').link(attach.url); break;
				// Ссылка
				case 'link'	: this.attachments[i] = ('&nbsp;' + attach.title).icon('link').link(attach.url); break;
				// Карта
				case 'geo'	: 
					attach.coordinates = attach.coordinates.split(' ');
					attach.coordinates = (attach.coordinates[0]-0) + ',' + (attach.coordinates[1]-0);
					this.attachments[i] = ('&nbsp;' + (attach.place ? attach.place.title : window.pop.geti18n('attr.location'))).icon('location').link('https://www.google.com.ua/maps/place/@' + attach.coordinates + ',13z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0'); break;
				// Стикеры
				case 'sticker': 
				this.attachments[i] = '<img class="emoji sticker" src="' + this.attachments[i].sticker.photo_64 + '" height="32">'; break;
				
				// Неподдерживаемое вложение
				default	 : this.attachments[i] = ('&nbsp;' + window.pop.geti18n('attr.attach')).icon('attach').link(this.url);
			}

			this.body += '<span class="attachments">' + this.attachments.join(' ') + '</span>';
		};
	}

	if (this.fwd_messages) {
		var fwd_text = '';
		if(this.parentMessage !== undefined){
			fwd_text = getCase(window.pop.geti18n('attr.fwd_mess'), this.fwd_messages.length).icon('chat').link(this.url);
		} else {
			for (var i = 0; i < this.fwd_messages.length; i++) {
				this.fwd_messages[i] = new Message(this.fwd_messages[i], this.parentDialog, this);
				if ((this.fwd_messages[i-1] != undefined && this.fwd_messages[i-1].user_id == this.fwd_messages[i].user_id)) {
					fwd_text += this.fwd_messages[i].getHtml();
				} else {
					fwd_text += this.fwd_messages[i].getHtml('compact');
				}
			};
		}
		this.body += '<div class="fwd">'+fwd_text+'</div>';
	}

	this.getHtml = function (type) {
		var messHtml = '';
		switch(type) {
			case 'compact' :  
				var author = this.from_id || this.user_id,
					user = window.pop.profiles[ author ];
				messHtml += '<div class="compact">'+user.ava({size:25, title: true})+'</div>';
			default : 
				messHtml += '<message class="short"><span class="body">'+this.body+'</span></message>';
		}
		return messHtml;
	}
}