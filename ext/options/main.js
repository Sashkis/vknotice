chrome.storage.local.get({'showMessage':false, 'audio':true, 'i18n':{}, 'options':'friends,photos,videos,messages,groups,notifications', 'loadComment':1}, function (storage) {
	jQuery('[data-loc]').each(function(index, el) {
		jQuery(el).text(getTrans(jQuery(el).attr('data-loc')));
	});
	console.log(storage);
	storage.options = storage.options.split(',');

	for (var i = 0; i < storage.options.length; i++) {
		if (storage.options[i] !== 'comments') {
			$('#' + storage.options[i]).prop('checked', true);
		}
	};
	// Опция аудио
	$('#audio').prop('checked', storage.audio === true)
	$('#showMessage').prop('checked', storage.showMessage === true)
	$('#comments').prop('checked', storage.loadComment === 1)

	// Событие переключения
	jQuery('.panel').on('change', 'input', function () {
		var new_options = '';
		jQuery('.noty input:checked').each(function (i, el) {
			var id = jQuery(el).attr('id');
			if (id !== 'comments') {
				new_options +=  id + ',';
			}
		});

		var save = {
			'options': new_options,
			'showMessage': $('#showMessage').prop('checked'),
			'audio': $('#audio').prop('checked'),
			'loadComment': $('#comments').prop('checked') ? 1 : 0
		};
		console.log(save);
		// Сохранение нового значения
		chrome.storage.local.set(save);
	});

	function getTrans(str) {
		var transMap = str.split('.'), trans = storage.i18n;
		for (var i = 0; i < transMap.length; i++) {
			trans = trans[transMap[i]];
		};
		if (typeof trans === 'string') {
			return trans;
		} else {
			return transMap[transMap.length - 1];
		}
	}
});