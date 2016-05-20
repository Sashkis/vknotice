/* globals $, chrome, navigator, Vk, console, User, Message*/
/*jshint esnext: true */
/*jshint -W097*/
"use strict";
/**
 * Объект диалога
 * @class
 * @param {Object} dialog_obj Объект диалога загруженный через API
 * @property {Number} id				ID последнего сообщения
 * @property {Number} date				Дата последнего сообщения
 * @property {Array}  message			Массив объектов сообщений
 * @property {Number} out				1 - Исходящее, 0 - Входящее последнее сообщение
 * @property {Number} read_state		1 - Сообщение прочитано
 * @property {String} title				Заголовок диалога
 */
function Dialog (dialog_obj, up) {
	this.isGroup = !!dialog_obj.chat_id;
	this.unread = dialog_obj.unread || 0;
	this.date = dialog_obj.date;
	this.out = dialog_obj.out;
	this.read_state = dialog_obj.read_state;

	if (!this.isGroup) {
		this.id = dialog_obj.user_id;
		this.url = `https://vk.com/im?sel=${this.id}`;
	} else {
		this.id = dialog_obj.chat_id;
		this.url = `https://vk.com/im?sel=c${this.id}`;
		this.title = dialog_obj.title;
		this.chat_active = dialog_obj.chat_active;
		this.photo_50 = dialog_obj.photo_50;
	}

	this.id -= 0; // Приведение к числу

	if ($.isEmptyObject(dialog_obj.messages)) {
		this.messages = [];
		delete dialog_obj.messages;
		this.messages.push(dialog_obj);
	} else {
		this.messages = dialog_obj.messages;
	}
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
		peer_id: this.isGroup ? this.id+2000000000 : this.id,
		url: this.url,
		hash: this.hash(),

	});

	// Вставляет ФОТО
	$d.find('.photo').html(() => {
		if (this.photo_50) {
			return new User().ava({
				size: 50,
				src: this.photo_50,
			});
		} else if (this.isGroup && $.isArray(this.chat_active)) {
			this.chat_active = this.chat_active.slice(0, 4);
			switch (this.chat_active.length) {
				case 1 : return users[this.chat_active[0]].ava({ size: 50 });
				case 2 : return [users[this.chat_active[0]].ava({ size: 50, type: 'half' }), users[this.chat_active[1]].ava({ size: 50, type: 'half' })];
				case 3 : return [users[this.chat_active[0]].ava({ size: 50, type: 'half' }), users[this.chat_active[1]].ava({ size: 23, type: 'quarter' }), users[this.chat_active[2]].ava({ size: 23, type: 'quarter' })];
				case 4 : return [users[this.chat_active[0]].ava({ size: 23, type: 'quarter' }), users[this.chat_active[1]].ava({ size: 23, type: 'quarter' }), users[this.chat_active[2]].ava({ size: 23, type: 'quarter' }), users[this.chat_active[3]].ava({ size: 23, type: 'quarter' })];
			}
		} else if (!this.isGroup) {
			return users[this.id].ava({ size: 50 });
		}
	});

	// Вставляет Имя
	$d.find('.name > .title').text(this.isGroup ? this.title : users[this.id].name);

	// Вставляет Текст сообщений
	$d.find('.mess-container').html(this.constructMessages(users));

	return $d;
};

/**
 * Генерирует сообщения
 */
Dialog.prototype.constructMessages = function (users) {
	return this.messages.reduceRight((html, mess) => html.concat(new Message(mess, this.url).getHtml(users, this.isGroup || this.out === 1 ? 'compact' : '')), []);
};

/**
 * Генерирует классы для диалога
 * @param  {String} custom	Дополнительный класс
 * @return {String}			Строка классов
 */
Dialog.prototype.getClass = function (custom) {
	return 'dialog ' +
		`${this.unread ? 'dialog-unread' : ''} ` +
		`${this.out && !this.read_state ? 'dialog-answer-unread' : ''} ` +
		`${this.isGroup ? 'dialog-group' : ''} ` +
		`${custom ? custom : ''}`;
}

/**
 * Генерирует хэш сообщений
 */
Dialog.prototype.hash = function () {
	return this.messages.reduce((sum, mess) => sum + mess.id, this.id);
};
