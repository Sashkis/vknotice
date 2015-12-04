/**
 * Объект диалога
 * @class
 * @param {Object} dialog_obj Объект диалога загруженный через API
 * @property {String} body				Текст последнего сообщения
 * @property {Number} date				Дата последнего сообщения
 * @property {Number} id				ID последнего сообщения
 * @property {Array.Message} message	Массив объектов сообщений
 * @property {Number} out				1 - Исходящее, 0 - Входящее последнее сообщение
 * @property {Number} read_state		1 - Сообщение прочитано
 * @property {String} title				Заголовок диалога
 * @property {Number} user_id			ID собеседника
 */
function Dialog (dialog_obj) {
	var VK = 'https://vk.com/';
	/**
	 * Инициализирует диалог
	 * @param {Object} dialog_obj		Объект диалога загруженный через API
	 * @see Dialog
	 */
	$.extend(this, dialog_obj);

	this.isGroup  = this.chat_id !== undefined;

	if ( this.isGroup ) {
		this.id = this.chat_id;
		this.url = VK + 'im?sel=c' + this.id;
	} else {
		this.id = this.user_id;
		this.url = VK + 'im?sel=' + this.id;
	}

	if ( $.isEmptyObject(dialog_obj.messages) ) {
		delete dialog_obj.messages;
		this.messages = [];
		this.messages.push(dialog_obj);
	}

	this.messages.sort(function (mess_first, mess_second) {
		return mess_first.date - mess_second.date;
	});
}

/**
 * Создаёт DOM елемент диалога.
 * @return {jQuery} Данный диалог
 */
Dialog.prototype.construct = function (users) {
	var dg = this;
	if ( dg.isGroup ) {
		var peer = {
			chat_id: dg.id
		};
	} else {
		var peer = {
			user_id: dg.id
		};

	}

	var $d = $('<a/>', {
		id: 'dialog-' + dg.id,
		'class': dg.getClass(),
		href: dg.url,
		html: $('<div/>', {
			'class':'container',
			html: [
				$('<div/>', {
					'class': 'header',
					html: [
						$('<i/>',{'class': 'icon-ok markAsRead'}),
						$('<i/>',{
							'class': 'icon-chat history slide',
							'data-target': '#history'
						}),
						$('<div/>',{'class': 'photo'}),
						$('<div/>',{
							'class': 'name',
							html: [
								$('<span/>',{'class': 'title'}), ,
								$('<span/>',{
									'class':'date',
									html: new Date(dg.date*1000).toStringVkFormat()
								}),
							],
						}),
					],
				}),
				$('<div/>', {'class': 'mess-container'}),
				$('<div/>', {
					'class': 'ans',
					html: $('<textarea/>')
				})
			]
		}),
	}).data({
		answer: peer,
		markAsRead: {
			peer_id: dg.id,
			start_message_id: dg.messages[0].id
		},
		url: dg.url,
		hash: dg.hash(),

	});

	// Вставляет ФОТО
	var html = null;
	$d.find('.photo').html( function () {
		if ( !!dg.photo_50 ) {
			return new User().ava({
				size: 50,
				src: dg.photo_50
			});
		} else if ( dg.isGroup && $.isArray( dg.chat_active ) ) {
			dg.chat_active = dg.chat_active.slice(0, 4);
			switch (dg.chat_active.length) {
				case 1 : return users[ dg.chat_active[0] ].ava({size: 50}); break;
				case 2 : return [ users[ dg.chat_active[0] ].ava({size: 50, type: 'half'}), users[ dg.chat_active[1] ].ava({size: 50, type: 'half'}) ]; break;
				case 3 : return [ users[ dg.chat_active[0] ].ava({size: 50, type: 'half'}), users[ dg.chat_active[1] ].ava({size: 23, type: 'quarter'}), users[ dg.chat_active[2] ].ava({size: 23, type: 'quarter'}) ]; break;
				case 4 : return [ users[ dg.chat_active[0] ].ava({size: 23, type: 'quarter'}), users[ dg.chat_active[1] ].ava({size: 23, type: 'quarter'}), users[ dg.chat_active[2] ].ava({size: 23, type: 'quarter'}), users[ dg.chat_active[3] ].ava({size: 23, type: 'quarter'}) ]; break;
			}
		} else {
			return users[ dg.user_id ].ava({size: 50});
		}
	} );


	// Вставляет Имя
	$d.find('.name').text( function () {
		if ( dg.isGroup ) {
			return dg.title;
		} else {
			return users[ dg.user_id ].name;
		}
	} );


	// Вставляет Текст сообщений
	$d.find('.mess-container').html( dg.constructMessages( users ) );

	return $d;
};

Dialog.prototype.constructMessages = function (users) {
	var html = [];
	var dg = this;
	$.each(dg.messages, function (i, mess) {
		mess = new Message( mess, dg.url );
		if ( dg.isGroup || dg.out === 1) {
			html.push( mess.getHtml(users, 'compact') );
		} else {
			html = html.concat( mess.getHtml() );
		}
	});
	return html;
}


/**
 * Генерирует классы для диалога
 * @param  {String} custom	Дополнительный класс
 * @return {String}			Строка классов
 */
Dialog.prototype.getClass = function (custom) {
	var dialogClass = (custom ? custom + ' ' : '') + 'dialog';
	if (!!this.unread) dialogClass += ' dialog-unread';
	if (this.out === 1) {
		dialogClass += ' dialog-answer';
		if (this.read_state === 0) {
			dialogClass += ' dialog-answer-unread';
		}
	}
	if (this.isGroup) dialogClass += ' dialog-group';
	return dialogClass;
};

/**
 * Генерирует хэш сообщений
 */
Dialog.prototype.hash = function () {
	return this.messages.reduce(function (sum, mess) {
		return sum + mess.id;
	}, this.id - 0);
};