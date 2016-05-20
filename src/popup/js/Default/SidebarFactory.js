angular.module('SidebarApp')
	.factory('sidebarMenu', ['i18n', function (i18n) {
		console.log("factory dropdownMenu");
		return function () {
			return [{
				id: 'profile',
				url: 'https://vk.com/vknotice?w=page-90041499_50788371',
				ancor: i18n.get('My Profile'),
			},{
				id: 'friends',
				url: 'https://vk.com/friends',
				ancor: i18n.get('Friends'),
				counter: true,
				target: 'newfriends',
			},{
				id: 'photos',
				url: 'https://vk.com/albums',
				ancor: i18n.get('Photos'),
				counter: true,
			},{
				id: 'videos',
				url: 'https://vk.com/video',
				ancor: i18n.get('Videos'),
				counter: true,
			},{
				id: 'audio',
				url: 'https://vk.com/audio',
				ancor: i18n.get('Music'),
			},{
				id: 'messages',
				url: 'https://vk.com/im',
				ancor: i18n.get('Messages'),
				counter: true,
				target: 'newmess',
			},{
				id: 'groups',
				url: 'https://vk.com/groups',
				ancor: i18n.get('Communities'),
				counter: true,
			},{
				id: 'feed',
				url: 'https://vk.com/feed',
				ancor: i18n.get('News'),
			},{
				id: 'comments',
				url: 'https://vk.com/feed?section=comments',
				ancor: i18n.get('Comments'),
			},

			];
		}
	}]);