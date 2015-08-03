chrome.storage.local.get({'showMessage':false, 'audio':true, 'i18n':{}, 'api':{}, 'options':'friends,photos,videos,messages,groups,notifications', 'loadComment':1}, function (storage) {
	$('[data-loc]').text(function () {
		var text = $(this).text();
		if (!!text && !!storage.i18n && storage.i18n[text] && storage.i18n[text][storage.api.lang] ) {
			return storage.i18n[text][storage.api.lang];
		}
	});

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
	$('.panel').on('change', 'input', function () {
		$(this).nextAll(".saveMess").animate({opacity: 0.5}, 300);
		var new_options = '';
		$('.noty input:checked').each(function (i, el) {
			var id = $(el).attr('id');
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
		// Сохранение нового значения
		chrome.storage.local.set(save, function () {
			setTimeout(function(){
				$(".saveMess").animate({opacity: 0}, 300);
			},1000);
		});
	});
});