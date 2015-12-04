/**
 * Класс сообщения
 * @constructor
 * @param {Object} mess_obj			Объект сообщения загруженный через API
 * @param {Dialog} parentDialog 	Объект родительского диалога
 * @param {Message} parentMessage	Объект родительского сообщения
 */
function Message (mess_obj, parentDialogUrl) {

	this.id = mess_obj.id;

	if ( mess_obj.out === 1 ) {
		this.user_id = Popup.current.id;
	} else {
		this.user_id = mess_obj.user_id;
	}

	if ( !!parentDialogUrl ) {
		this.url = parentDialogUrl + '&msgid=' + this.id;
	}


	if ( !!mess_obj.action ) {
		this.body = [ $('<span/>', {
			'class': 'system',
			html: Popup.loc(mess_obj.action),
		}) ];
	} else if ( !!mess_obj.body ) {
		mess_obj.body = mess_obj.body.escapeHtml();

		if (mess_obj.emoji === 1) {
			mess_obj.body = window.Emoji.emojiToHTML(mess_obj.body);
		}

		this.body = [ $('<span/>', {html: mess_obj.body + ' '}).linkify({
			format: function (value, type) {
				if (type === 'url' && value.length > 36) {
					value = value.substr(0, 35) + '…';
				}
				return value;
			}
		}) ];
	} else {
		this.body = [];
	}

	// Добавляем код карту во вложения
	if ( !!mess_obj.geo ) {
		if (mess_obj.attachments === undefined) {
			mess_obj.attachments = [];
		}
		mess_obj.attachments.push({
			type: 'geo',
			geo: mess_obj.geo
		});
		delete mess_obj.geo;
	}

	// Добавляем код вложений
	if ( !!mess_obj.attachments ) {
		var mess = this;
		mess_obj.attachments = mess_obj.attachments.map(function (attach) {
			var VK = 'https://vk.com/';
			var type = attach.type;
			var attach = attach[type];
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

					return $('<a/>', {
						href: attach.url,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-camera'}),
							Popup.loc('Photo'),
						]
					});

				// Подарок
				case 'gift':
					attach.url = '';
					if		(attach['thumb_256'])	attach.url = attach['thumb_256'];
					else if (attach['thumb_96'])	attach.url = attach['thumb_96'];
					else if (attach['thumb_48'])	attach.url = attach['thumb_48'];

					return $('<a/>', {
						href: attach.url,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-gift'}),
							Popup.loc('Gift'),
						]
					});

				// Пост
				case 'wall' :
					return $('<a/>', {
						href: VK + 'wall' + attach.from_id + '_' + attach.id,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-pencil'}),
							Popup.loc('Post'),
						]
					});

				// Комментарий
				case 'wall_reply' :
					return $('<a/>', {
						href: VK + 'wall' + attach.owner_id + '_' + attach.post_id + '?reply=' + attach.id,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-chat'}),
							Popup.loc('Comment'),
						]
					});

				// Аудиозапись
				case 'audio':
					return $('<a/>', {
						href: VK + 'audio' + attach.owner_id + '_' + attach.id,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-music'}),
							attach.artist.bold() + '&nbsp;–&nbsp;' + attach.title,
						]
					});

				// Видеозапись
				case 'video':
					return $('<a/>', {
						href: VK + 'video' + attach.owner_id + '_' + attach.id,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-video'}),
							attach.title,
						]
					});

				// Документ
				case 'doc'	:
					return $('<a/>', {
						href: attach.url,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-doc'}),
							attach.title,
						]
					});

				// Ссылка
				case 'link'	:
					return $('<a/>', {
						href: attach.url,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-link'}),
							attach.title,
						]
					});

				// Карта
				case 'geo':
					attach.coordinates = attach.coordinates.split(' ');
					attach.coordinates = (attach.coordinates[0]-0) + ',' + (attach.coordinates[1]-0);
					return $('<a/>', {
						href: 'https://www.google.com.ua/maps/place/@' + attach.coordinates + ',13z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0',
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-location'}),
							(attach.place ? attach.place.title : window.Popup.loc('Map')),
						]
					});

				// Стикеры
				case 'sticker':
					return $('<img/>', {
						'class': 'emoji sticker',
						src: attach.photo_64,
						height: '32'
					})

				// Неподдерживаемое вложение
				default	 :
					return $('<a/>', {
						href: mess.url,
						target: '_blank',
						html: [
							$('<i/>', {'class': 'icon-attach'}),
							Popup.loc('Attachment'),,
						]
					});
			}
		});
		this.body = this.body.concat( mess_obj.attachments );
	}

	if (mess_obj.fwd_messages) {
		var count = 0;
		if ( $.isArray( mess_obj.fwd_messages ) ) {
			count = mess_obj.fwd_messages.length;
		} else if ( $.isNumeric( mess_obj.fwd_messages ) ) {
			count = mess_obj.fwd_messages - 0;
		}

		this.body.push( $('<a/>', {
			href: this.url,
			target: '_blank',
			html: [
				$('<i/>', { 'class':'icon-chat' }),
				getCase( count, Popup.loc('forwarded messages') )
			],
		}) );
	}
};

/**
 * Возвращает сгенерированный код сообщения
 * @param  {String} type Формат сообщения
 * @return {String}      HTML code
 */
Message.prototype.getHtml = function (users, type) {
	switch(type) {
		case 'compact':
			return $('<message/>', {
				html: [ users[ this.user_id ].ava({size:25, title: true, marker: false}) ].concat(this.body)
			});
		default :
			return this.body;
	}
};