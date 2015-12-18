/* globals $, chrome, App*/
/*jshint esnext: true */
/*jshint -W097*/

"use strict";
const app = new App();
$.when(app.loadTranslate(), app.load({
		'showMessage':false,
		'audio':true,
		'lang':0,
		'options':'friends,photos,videos,messages,groups,notifications',
		'isLoadComment':0
	})
).done((app, stg) => {
	// Локализация
	$('[loc]').text((i, text) => app.loc(text, false));

	// Настройки уведомлений
	$.each(stg.options.split(','), (i, opt) => $(`#${opt}`).prop('checked', true));

	// Настройки комментариев
	$('#comments').prop('checked', stg.isLoadComment);

	// Настройки Информера
	$('#audio').prop('checked', stg.audio);
	$('#showMessage').prop('checked', stg.showMessage);

	$('#donate').html(
		$('<form/>', {
			method: 'POST',
			'accept-charset': 'utf-8',
			action: 'https://www.liqpay.com/api/checkout',
			html: [
				$('<input/>', {
					type: 'hidden',
					name: 'data',
					value: 'eyJ2ZXJzaW9uIjozLCJwdWJsaWNfa2V5IjoiaTU4NDM5MzEwOTQ4IiwiYW1vdW50IjoiMTAwIiwiY3VycmVuY3kiOiJSVUIiLCJkZXNjcmlwdGlvbiI6ItCd0LAg0YDQsNC30LLQuNGC0LjQtSDQmNC90YTQvtGA0LzQtdGA0LAiLCJ0eXBlIjoiZG9uYXRlIiwibGFuZ3VhZ2UiOiJydSIsInBheV93YXkiOiJjYXJkLGxpcXBheSxkZWxheWVkLGludm9pY2UscHJpdmF0MjQifQ=='
				}),
				$('<input/>', {
					type: 'hidden',
					name: 'signature',
					value: stg.lang < 3 ? 'KqL70cSIpiTXOqJKFKKWJlkY3rc=' : 'R06+DNg9YGFDKzv7jkSRoQCL3B0='
				}),
				$('<input/>', {
					type: 'image',
					name: 'btn_text',
					src: `https://static.liqpay.com/buttons/d6${stg.lang < 3 ? 'ru' : 'en'}.png`
				}),
			]
		})
	);

	// Событие переключения
	$('.panel').on('change', 'input', function () {
		let new_options = '';
		$('input.main-opt:checked').each((i, el) => new_options += $(el).attr('id') + ',');

		// Сохранение нового значения
		chrome.storage.local.set({
			'options': new_options,
			'showMessage': $('#showMessage').prop('checked'),
			'audio': $('#audio').prop('checked'),
			'isLoadComment': $('#comments').prop('checked') ? 1 : 0 // Значением должен быть 0 или 1
		});
	});
});
