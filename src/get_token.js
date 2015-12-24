/*jshint esnext: true */

(function () {
	"use strict";
	function parseHash (hash) {
		const ret = {};

		hash = hash.replace('#', '').split('&');
		for (let i = hash.length; i--;) {
			if (!hash[i]) continue;

			let s = hash[i].split('=');
			ret[s[0]] = s[1];
		}
		return ret;
	}

	const auth = parseHash(location.hash);

	if (auth.state === 'vknotice' && auth.access_token && auth.user_id) {
		chrome.storage.local.set({
			user_id: auth.user_id,
			access_token: auth.access_token,
		}, () => window.close());
	}
})();
