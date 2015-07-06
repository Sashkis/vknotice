function Dialog (dialog_obj) {
	var VK = 'https://vk.com/';
			
	this.init = function (dialog_obj) {
		for (var p in dialog_obj) {
			if (p !== 'message') {
				this[p] = dialog_obj[p];
			}
		}

		this.messages = [];
		this.isGroup  = this.chat_id !== undefined;

		if (this.isGroup) {
			this.id = this.chat_id;
			this.url = VK + 'im?sel=c' + this.id;
		} else {
			this.id = this.user_id;
			this.url = VK + 'im?sel=' + this.id;
		}
		if (dialog_obj.message.length === 0) {
			this.addMess(dialog_obj);
		} else {
			this.addMess(dialog_obj.message);
		}
	};

	this.addMess = function (mess_array) {
		if (mess_array.length === undefined) {
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

	
	this.addHeader = function (options) {
		options = jQuery.extend({
			class: '',
			photo: '',
			title: window.pop.geti18n('attr.chat'),
			messages: ''
		}, options);
		return '<div class="header ' + options.class + '">' + options.photo + '<span class="name">' + options.title + ' <span class="date">' + new Date(this.date*1000).toStringVkFormat() + '</span></span><span class="mess-container">' + options.messages + '</span></div>';
	};

	this.getObj = function () {
		var html = '', i;
		if (!this.isGroup) {
			for (i = this.messages.length; i--;) {
				if (this.messages[i].out === 0) {
					html += this.messages[i].getHtml();
				} else {
					this.messages[i].from_id = window.pop.current.id;
					html += this.messages[i].getHtml('compact');
				}
			}
			var author = new User(this.id);
			return {
				photo: author.ava({size: 50}),
				title: author.name(),
				messages: html
			};
		} else {
			for (i = this.messages.length; i--;) {
				if (this.messages[i+1] === undefined || this.messages[i].from_id !== this.messages[i+1].from_id) {
					html += this.messages[i].getHtml('compact');
				} else {
					html += this.messages[i].getHtml();
				}
			}
			return {
				class: 'group',
				photo: this.getGroupPhoto(),
				title: this.title,
				messages: html
			};
		};
	};

	this.getGroupPhoto = function () {
		if (this.photo_50) {
			return '<div class="group-photo"><img class="ava ava-full" src="' + this.photo_50 + '" widht="50" height="50"></div>';
		}
		if (!this.chat_active) {
			this.chat_active = [new User(this.user_id)];
		} else {
			this.chat_active = this.chat_active.slice(0,4);
			for (var i = this.chat_active.length; i--;) {
				this.chat_active[i] = new User(this.chat_active[i]);
			};
		}

		switch (this.chat_active.length) {
			case 1 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 50}) + '</div>'; break;
			case 2 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 50, type: 'half'}) + this.chat_active[1].ava({size: 50, type: 'half'}) + '</div>'; break;
			case 3 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 50, type: 'half'}) + this.chat_active[1].ava({size: 23, type: 'quarter'}) + this.chat_active[2].ava({size: 23, type: 'quarter'}) + '</div>'; break;
			case 4 : return '<div class="group-photo">' + this.chat_active[0].ava({size: 23, type: 'quarter'}) + this.chat_active[1].ava({size: 23, type: 'quarter'}) + this.chat_active[2].ava({size: 23, type: 'quarter'}) + this.chat_active[3].ava({size: 23, type: 'quarter'}) + '</div>'; break;
		}
	};

	this.getClass = function (custom) {
		var dialogClass = 'dialog';
		if (!!this.unread) dialogClass += ' dialog-unread';
		if (this.out === 1) dialogClass += ' dialog-ansver';
		if (this.isGroup) dialogClass += ' dialog-group';
		return dialogClass + ' ' + (custom || '');
	};

	this.construct = function () {
		this.jQ = jQuery(''.link(this.url, {id: 'dialog-' + this.id, class: this.getClass()}));
		this.jQ.html((this.addHeader(this.getObj()) + '<div class="ans"><textarea></textarea></div>').icon('cancel', {class: 'markAsRead', title: window.pop.geti18n('attr.markAsRead')}));
		this.jQ.data(this);
		return this.jQ;
	};


	// Помечаем сообщения как прочитанные
	this.markAsRead = function () {
		var dialogCash = this,
			message_ids = this.messages.map(function (mess) {
				return mess.id;
			});
		window.pop.callAPI('messages.markAsRead', {
			message_ids: message_ids,
			user_id: ''
		}, function () {
			dialogCash.jQ.trigger('onMarkAsRead', dialogCash);
		});
		return true;
	};

	// Отправляем ответ
	this.sendAnswer = function (text) {
		var dialogCash = this,
			sendOptions = {
				message: text
			};
		if (this.isGroup) {
			sendOptions.user_id = '';
			sendOptions.chat_id = this.id;
		} else {
			sendOptions.user_id = this.id;
			sendOptions.chat_id = '';
		}
		window.pop.callAPI('messages.send', sendOptions, function () {
			dialogCash.jQ.find('textarea').val('').removeAttr('disabled').focus();
			dialogCash.jQ.trigger('onSendAnswer', [dialogCash, text]).trigger('onMarkAsRead', dialogCash);
		});

		return true;
	};

	// Обновляем диалог по новым данным
	this.update = function (dialog_obj) {
		var isOpen = this.jQ.hasClass('open');
		delete this.unread;
		this.init(dialog_obj);
		this.jQ.removeAttr('class').addClass(this.getClass(isOpen ? 'open' : ''));
		this.jQ.find('.mess-container').html(this.getObj().messages);
		this.jQ.data(this);
	};

	this.hash = function () {
		var summ = 0, i,
			message_ids = this.messages.map(function (mess) {
				return mess.id - 0;
			});

		for (i = message_ids.length; i--;) {
			summ += message_ids[i];
		};

		return this.id - 0 + summ;
	};

	this.init(dialog_obj);
}