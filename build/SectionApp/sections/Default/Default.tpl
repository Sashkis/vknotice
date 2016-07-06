<aside ng-controller="SidebarCtrl as sidebar">
	<a ng-href="https://vk.com/" >
		<translate>Моя Страница</translate>
	</a>
	<a ng-href="https://vk.com/friends" >
		<translate>Друзья</translate>
		<span class="counter" ng-click="main.openSection('NewFriends', $event)" ng-if="sidebar.stg.counter.friends">
			{{'+'+sidebar.stg.counter.friends}}
		</span>
	</a>
	<a ng-href="https://vk.com/albums" >
		<translate>Фотографии</translate>
		<span class="counter" ng-if="sidebar.stg.counter.photos">{{'+'+sidebar.stg.counter.photos}}</span>
	</a>
	<a ng-href="https://vk.com/video" >
		<translate>Видеозаписи</translate>
		<span class="counter" ng-if="sidebar.stg.counter.videos">{{'+'+sidebar.stg.counter.videos}}</span>
	</a>
	<a ng-href="https://vk.com/audio" >
		<translate>Аудиозаписи</translate>
	</a>
	<a ng-href="https://vk.com/im" >
		<translate>Сообщения</translate>
		<span class="counter" ng-click="main.openSection('NewMess', $event)">
			{{sidebar.stg.counter.messages ? '+'+sidebar.stg.counter.messages : '+'}}
		</span>
	</a>
	<a ng-href="https://vk.com/groups" >
		<translate>Группы</translate>
		<span class="counter" ng-if="sidebar.stg.counter.groups">{{'+'+sidebar.stg.counter.groups}}</span>
	</a>
	<a ng-href="https://vk.com/feed" >
		<translate>Новости</translate>
	</a>
	<a ng-href="https://vk.com/feed?section=comments" >
		<translate>Комментарии</translate>
		<span class="counter" ng-if="sidebar.stg.counter.comments">{{'+'+sidebar.stg.counter.comments}}</span>
	</a>
</aside>

<div id="friends-online" ng-controller="FriendsCtrl as friend">
	<friend id="user_id.id" ng-repeat="user_id in friend.stg.profiles"></friend>
</div>
