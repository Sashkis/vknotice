var port = chrome.runtime.connect({name: 'get_token'});
port.postMessage(location.hash);
port.onMessage.addListener(function (close) {
	if (close === true) {
		window.close();
	}
});