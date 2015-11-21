chrome.storage.local.get({'showMessage':false, 'audio':true, 'i18n':{}, 'lang':0, 'options':'friends,photos,videos,messages,groups,notifications', 'loadComment':0}, function (storage) {
	$('[data-loc]').text(function (i, text) {
		if (!!text && !!storage.i18n && storage.i18n[text] && storage.i18n[text][storage.lang] ) {
			return storage.i18n[text][storage.lang];
		}
	});

	if (storage.lang < 3) {
		$('#donate').html('<form method="POST" accept-charset="utf-8" action="https://www.liqpay.com/api/checkout"><input type="hidden" name="data" value="eyJ2ZXJzaW9uIjozLCJwdWJsaWNfa2V5IjoiaTU4NDM5MzEwOTQ4IiwiYW1vdW50IjoiMTAwIiwiY3VycmVuY3kiOiJSVUIiLCJkZXNjcmlwdGlvbiI6ItCd0LAg0YDQsNC30LLQuNGC0LjQtSDQmNC90YTQvtGA0LzQtdGA0LAiLCJ0eXBlIjoiZG9uYXRlIiwibGFuZ3VhZ2UiOiJydSIsInBheV93YXkiOiJjYXJkLGxpcXBheSxkZWxheWVkLGludm9pY2UscHJpdmF0MjQifQ==" /><input type="hidden" name="signature" value="KqL70cSIpiTXOqJKFKKWJlkY3rc=" /><input type="image" src="https://static.liqpay.com/buttons/d6ru.png" name="btn_text" /></form>');
	} else {
		$('#donate').html('<form method="POST" accept-charset="utf-8" action="https://www.liqpay.com/api/checkout"><input type="hidden" name="data" value="eyJ2ZXJzaW9uIjozLCJwdWJsaWNfa2V5IjoiaTU4NDM5MzEwOTQ4IiwiYW1vdW50IjoiMTAwIiwiY3VycmVuY3kiOiJSVUIiLCJkZXNjcmlwdGlvbiI6ItCd0LAg0YDQsNC30LLQuNGC0LjQtSDQmNC90YTQvtGA0LzQtdGA0LAiLCJ0eXBlIjoiZG9uYXRlIiwibGFuZ3VhZ2UiOiJlbiIsInBheV93YXkiOiJjYXJkLGxpcXBheSxkZWxheWVkLGludm9pY2UscHJpdmF0MjQifQ==" /><input type="hidden" name="signature" value="R06+DNg9YGFDKzv7jkSRoQCL3B0=" /><input type="image" src="https://static.liqpay.com/buttons/d6en.png" name="btn_text" /></form>');
	}

	// Настройки уведомлений
	storage.options = storage.options.split(',');

	for (var i = 0; i < storage.options.length; i++) {
		if (storage.options[i] !== 'comments') {
			$('#' + storage.options[i]).prop('checked', true);
		}
	};

	// Настройки комментариев
	$('#comments').prop('checked', storage.loadComment === 1)

	// Настройки Информера
	$('#audio').prop('checked', storage.audio === true)
	$('#showMessage').prop('checked', storage.showMessage === true)

	// Событие переключения
	$('.panel').on('change', 'input', function () {
		$(this).nextAll(".saveMess").animate({opacity: 0.5}, 300);
		var new_options = '';
		$('.noty input:checked').each(function (i, el) {
			var id = $(el).attr('id');
			if (id !== 'comments') {
				new_options +=  id + ',';
			}
		});
		// Сохранение нового значения
		chrome.storage.local.set({
			'options': new_options,
			'showMessage': $('#showMessage').prop('checked'),
			'audio': $('#audio').prop('checked'),
			'loadComment': $('#comments').prop('checked') ? 1 : 0
		}, function () {
			setTimeout(function(){
				$(".saveMess").animate({opacity: 0}, 300);
			},1000);
		});
	});
});