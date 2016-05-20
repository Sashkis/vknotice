angular.module('SectionsApp', ['DefaultSectionApp'])
	.constant('sections', {
		'default':    'js/Default/DefaultTempl.html',
		'newmess':    'js/NewMess/NewMessTempl.html',
		'history':    'js/History/HistoryTempl.html',
		'newfriends': 'js/NewFriends/NewFriendsTempl.html',
	});