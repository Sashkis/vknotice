/*jshint esnext: true */

(function () {
	"use strict";
	function parseURL (url) {
		url = url.replace('#', '');
		const ret = {};
		const seg = url.split('&');
		const len = seg.length;
		for (let i = 0; i < len; i++) {
			if (!seg[i]) {
				continue;
			}
			let s = seg[i].split('=');
			ret[s[0]] = s[1];
		}
		return ret;
	}

	const auth = parseURL(location.hash);

	if ( auth.state === 'vknotice' && !!auth.access_token && !!auth.user_id ) {
		chrome.storage.local.set({
			user_id: auth.user_id,
			access_token: auth.access_token,
		});
	}
})();
