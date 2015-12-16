/* globals $, chrome, navigator, Vk, console, User, Message*/
/*jshint esnext: true */
/*jshint -W097*/
"use strict";
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
	/**
	 * Инициализирует диалог
	 * @param {Object} dialog_obj		Объект диалога загруженный через API
	 * @see Dialog
	 */
	$.extend(this, dialog_obj);

	this.isGroup = this.chat_id !== undefined;

	if ( this.isGroup ) {
		this.id = this.chat_id;
		this.url = `https://vk.com/im?sel=c${this.id}`;
	} else {
		this.id = this.user_id;
		this.url = `https://vk.com/im?sel=${this.id}`;
	}

	this.id -= 0; // Приведение к числу

	if ( $.isEmptyObject(dialog_obj.messages) ) {
		delete dialog_obj.messages;
		this.messages = [];
		this.messages.push(dialog_obj);
	}

	this.messages.sort((f, s) => f.date - s.date);
}

/**
 * Создаёт DOM елемент диалога.
 * @return {jQuery} Данный диалог
 */
Dialog.prototype.construct = function (users) {
	const $d = $('<a/>', {
		id: 'dialog-' + this.id,
		'class': this.getClass(),
		href: this.url,
		html: $('<div/>', {
			'class': 'container',
			html: [
				$('<div/>', {
					'class': 'header',
					html: [
						$('<i/>', {'class': 'icon-ok markAsRead'}),
						$('<i/>', {
							'class': 'icon-chat history slide',
							'data-target': '#history'
						}),
						$('<div/>', {'class': 'photo'}),
						$('<div/>', {
							'class': 'name',
							html: [
								$('<span/>', {'class': 'title'}),
								$('<span/>', {
									'class': 'date',
									html: new Date(this.date*1000).toStringVkFormat()
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
		peer: {
			[this.isGroup ? 'chat_id' : 'user_id'] : this.id
		},
		markAsRead: {
			peer_id: this.id + (this.isGroup ? 2000000000 : 0)
		},
		url: this.url,
		hash: this.hash(),

	});

	// Вставляет ФОТО
	$d.find('.photo').html(() => {
		if ( !!this.photo_50 ) {
			return new User().ava({
				size: 50,
				src: this.photo_50
			});
		} else if ( this.isGroup && $.isArray( this.chat_active ) ) {
			this.chat_active = this.chat_active.slice(0, 4);
			switch (this.chat_active.length) {
				case 1 : return users[ this.chat_active[0] ].ava({size: 50});
				case 2 : return [ users[ this.chat_active[0] ].ava({size: 50, type: 'half'}), users[ this.chat_active[1] ].ava({size: 50, type: 'half'}) ];
				case 3 : return [ users[ this.chat_active[0] ].ava({size: 50, type: 'half'}), users[ this.chat_active[1] ].ava({size: 23, type: 'quarter'}), users[ this.chat_active[2] ].ava({size: 23, type: 'quarter'}) ];
				case 4 : return [ users[ this.chat_active[0] ].ava({size: 23, type: 'quarter'}), users[ this.chat_active[1] ].ava({size: 23, type: 'quarter'}), users[ this.chat_active[2] ].ava({size: 23, type: 'quarter'}), users[ this.chat_active[3] ].ava({size: 23, type: 'quarter'}) ];
			}
		} else {
			return users[ this.user_id ].ava({size: 50});
		}
	} );

	// Вставляет Имя
	$d.find('.name > .title').text(() => {
		return this.isGroup ? this.title : users[ this.user_id ].name;
	} );

	// Вставляет Текст сообщений
	$d.find('.mess-container').html( this.constructMessages( users ) );

	return $d;
};

Dialog.prototype.constructMessages = function (users) {
	let html = [];
	$.each(this.messages, (i, mess) => {
		mess = new Message( mess, this.url );
		if ( this.isGroup || this.out === 1) {
			html.push( mess.getHtml(users, 'compact') );
		} else {
			html = html.concat( mess.getHtml() );
		}
	});
	return html;
};


/**
 * Генерирует классы для диалога
 * @param  {String} custom	Дополнительный класс
 * @return {String}			Строка классов
 */
Dialog.prototype.getClass = function (custom) {

	return 'dialog ' +
		`${!!this.unread ? 'dialog-unread' : ''} ` +
		`${!!this.out ? `dialog-answer ${this.read_state ? 'dialog-answer-unread' : ''}` : ''} ` +
		`${this.isGroup ? 'dialog-group' : ''} ` +
		`${custom ? custom : ''}`;
}

/**
 * Генерирует хэш сообщений
 */
Dialog.prototype.hash = function () {
	return this.messages.reduce((sum, mess) => sum + mess.id, this.id);
};