function parseURL (url) {
	url = url.replace('#', '');
	var ret = {},
		seg = url.split('&'),
		len = seg.length,
		i = 0,
		s;
	for (; i < len; i++) {
		if (!seg[i]) {
			continue;
		}
		s = seg[i].split('=');
		ret[s[0]] = s[1];
	}
	return ret;
};

var auth = parseURL(location.hash);

if ( auth.state === 'vknotice' && !!auth.access_token && !!auth.user_id ) {
	chrome.storage.local.set({
		user_id: auth.user_id,
		access_token: auth.access_token,
	});
}