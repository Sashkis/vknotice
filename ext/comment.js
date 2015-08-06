function save() {
	if (/vk.com\/feed\?section=comments/.test(location.href)) {
		chrome.storage.local.set({
			'openComment': parseInt(new Date().getTime()/1000)
		});
	}
};

save();

setInterval(save, 1000);