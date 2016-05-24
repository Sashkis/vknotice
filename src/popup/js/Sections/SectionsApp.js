angular.module('SectionsApp', ['DefaultSectionApp', 'NewFriendsApp'])
	.constant('sections', {
		'default':    'js/Default/DefaultTempl.html',
		'messages':   'js/NewMess/NewMessTempl.html',
		'history':    'js/History/HistoryTempl.html',
		'friends': 	  'js/NewFriends/NewFriendsTempl.html',
	});