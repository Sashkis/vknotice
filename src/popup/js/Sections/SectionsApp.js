angular.module('SectionsApp', ['DefaultSectionApp'])
	.constant('sections', {
		'default':    'js/Default/DefaultTempl.html',
		'messages':   'js/NewMess/NewMessTempl.html',
		'history':    'js/History/HistoryTempl.html',
		'newfriends': 'js/NewFriends/NewFriendsTempl.html',
	});