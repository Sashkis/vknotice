angular.module('SectionsApp', ['ProfileApp', 'VkApp'])
	.constant('sections', {
		'default':    '../SectionApp/sections/Default/DefaultTempl.html',
		'friends': 	  '../SectionApp/sections/NewFriends/NewFriendsTempl.html',
		'messages':   '../SectionApp/sections/NewMess/NewMessTempl.html',
	});