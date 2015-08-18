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
	this.init = function (dialog_obj) {
		$.extend(this, dialog_obj);
		delete this.message;
		this.messages = [];
		this.isGroup  = this.chat_id !== undefined;

		if (this.isGroup) {
			this.id = this.chat_id;
			this.url = VK + 'im?sel=c' + this.id;
		} else {
			this.id = this.user_id;
			this.url = VK + 'im?sel=' + this.id;
		}
		if ($.isArray(dialog_obj.message) && dialog_obj.message.length !== 0) {
			this.addMess(dialog_obj.message);
		} else {
			this.addMess(dialog_obj);
		}
	};

	/**
	 * Добавляет одно или несколько сообщений в диалог
	 * @param {Array.Object|Object} mess_array	Объект или Массив объектов сообщений загруженных через API
	 * @return {Boolean} 						TRUE в случае успешного выполнения
	 */
	this.addMess = function (mess_array) {
		if (!$.isArray(mess_array)) {
			mess_array = [mess_array];
		}
		for (var i = mess_array.length; i--;) {
			// Добавляем сообщение к диалогу
			this.messages.push(new Message(mess_array[i], this));
		};
		// Сортируем
		this.messages.sort(function (mess_first, mess_second) {
			return mess_second.date - mess_first.date;
		});

		return true;
	};

	/**
	 * Генерирует шапку диалога
	 * @param {Object} options			Опции заголовка
	 * @param {String} options.class	атрибут Class для шапки
	 * @param {String} options.photo	Фото
	 * @param {String} options.title	Текст заголовка
	 * @param {String} options.messages Текст сообщений
	 */
	this.addHeader = function () {
		var options = $.extend({
			class: '',
			photo: '',
			title: window.Popup.loc('Chat'),
			messages: ''
		}, this.getHeaderObj());
		return '<div class="header ' + options.class + '">' + options.photo + '<span class="name">' + options.title + ' <span class="date">' + new Date(this.date*1000).toStringVkFormat() + '</span></span><span class="mess-container">' + options.messages + '</span></div>';
	};

	/**
	 * Генерирует объект для шапки диалога
	 * @see addHeader
	 * @return {Object} Объект для шапки диалога
	 */
	this.getHeaderObj = function () {
		if (!this.isGroup) {
			var author = new User(this.id);
			return {
				photo: author.ava({size: 50}),
				title: author.name,
				messages: this.messages.reduceRight(function (html, mess) {
					if (mess.out === 0) {
						return html + mess.getHtml();
					} else {
						mess.from_id = window.Popup.current.id;
						return html + mess.getHtml('compact');
					}
				}, '')
			};
		} else {
			return {
				class: 'group',
				photo: this.getGroupPhoto(),
				title: this.title,
				messages: this.messages.reduceRight(function (html, mess, i, arr) {
					if (arr[i+1] === undefined || mess.from_id !== arr[i+1].from_id) {
						return html + mess.getHtml('compact');
					} else {
						return html + mess.getHtml();
					}
				}, '')
			};
		};
	};

	/**
	 * Генерирует код групового фото
	 * @return {String} HTML код
	 */
	this.getGroupPhoto = function () {
		if (this.photo_50) {
			return '<div class="group-photo"><img class="ava ava-full" src="' + this.photo_50 + '" widht="50" height="50"></div>';
		}
		if (!this.chat_active) {
			this.chat_active = [new User(this.user_id)];
		} else {
			this.chat_active = this.chat_active.slice(0, 4).map(function (user_id) {
				return new User(user_id);
			});
		}

		switch (this.chat_active.length) {
			case 1 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 50}) + '</div>'; break;
			case 2 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 50, type: 'half'}) + this.chat_active[1].ava({size: 50, type: 'half'}) + '</div>'; break;
			case 3 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 50, type: 'half'}) + this.chat_active[1].ava({size: 23, type: 'quarter'}) + this.chat_active[2].ava({size: 23, type: 'quarter'}) + '</div>'; break;
			case 4 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 23, type: 'quarter'}) + this.chat_active[1].ava({size: 23, type: 'quarter'}) + this.chat_active[2].ava({size: 23, type: 'quarter'}) + this.chat_active[3].ava({size: 23, type: 'quarter'}) + '</div>'; break;
		}
	};

	/**
	 * Генерирует классы для диалога
	 * @param  {String} custom	Дополнительный класс
	 * @return {String}			Строка классов
	 */
	this.getClass = function (custom) {
		var dialogClass = (custom ? custom + ' ' : '') + 'dialog';
		if (!!this.unread) dialogClass += ' dialog-unread';
		if (this.out === 1) {
			dialogClass += ' dialog-ansver';
			if (this.read_state === 0) {
				dialogClass += ' dialog-ansver-unread';
			}
		}
		if (this.isGroup) dialogClass += ' dialog-group';
		return dialogClass;
	};

	/**
	 * Создаёт DOM елемент диалога.
	 * @return {jQuery} Данный диалог
	 */
	this.construct = function () {
		this.jQ = $(''.link(this.url, {id: 'dialog-' + this.id, class: this.getClass()}));
		this.jQ.html((this.addHeader() + '<div class="ans"><textarea></textarea></div>').icon('cancel', {class: 'markAsRead', title: window.Popup.loc('Mark as read')}));
		this.jQ.data(this);
		return this.jQ;
	};

	/**
	 * Помечает все сообщения в диалоге как прочитанные
	 * @return {Boolean} TRUE в случае успешного выполнения
	 */
	this.markAsRead = function () {
		var message_ids = this.messages.map(function (mess) {
				return mess.id;
			});
		window.Popup.callAPI('messages.markAsRead', {
			context: this,
			data: {
				message_ids: message_ids,
				user_id: ''
			},
			done: function () {
				this.jQ.trigger('onMarkAsRead', this);
			}
		});
		return true;
	};

	/**
	 * Отправляет сообщение в диалог
	 * @param  {String} text Текст ответа
	 */
	this.sendAnswer = function (text) {
		var sendOptions = {
				message: text
			};
		if (this.isGroup) {
			sendOptions.user_id = '';
			sendOptions.chat_id = this.id;
		} else {
			sendOptions.user_id = this.id;
			sendOptions.chat_id = '';
		}
		window.Popup.callAPI('messages.send', {
			context: this,
			data: sendOptions,
			done: function () {
				this.jQ.find('textarea').val('').removeClass('error');
				this.jQ.trigger('onSendAnswer', [this, text]).trigger('onMarkAsRead', this);
			},
			fail: function () {
				this.jQ.find('textarea').addClass('error');
			},
			always: function () {
				this.jQ.find('textarea').removeAttr('disabled').focus();
			}
		});
	};

	/**
	 * Обновляет данные в диалоге
	 * @param  {Object} dialog_obj	Объект диалога загруженный через API
	 * @return {jQuery}				Данный диалог
	 */
	this.update = function (dialog_obj) {
		var isOpen = this.jQ.hasClass('open');
		delete this.unread;
		this.init(dialog_obj);
		this.jQ.removeAttr('class').addClass(this.getClass(isOpen ? 'open' : ''));
		this.jQ.find('.mess-container').html(this.getHeaderObj().messages).linkify({
			format: function (value, type) {
				if (type === 'url' && value.length > 40) {
					value = value.substr(0, 40) + '…';
				}
				return value;
			}
		});
		return this.jQ.data(this);
	};

	/**
	 * @return {Number} Цифровая подпись диалога
	 */
	this.hash = function () {
		return this.messages.reduce(function (sum, mesage) {
			return sum + mesage.id;
		}, this.id - 0);
	};

	this.init(dialog_obj);
}