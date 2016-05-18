angular.module('SectionsApp', ['PopupSidebarApp'])
	.constant('sections', {
		'default':    'js/Sidebar/DefaultTempl.html',
		'newmess':    'js/NewMess/NewMessTempl.html',
		'history':    'js/History/HistoryTempl.html',
		'newfriends': 'js/NewFriends/NewFriendsTempl.html',
	});