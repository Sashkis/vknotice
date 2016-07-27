<section class="flex">
	<aside ng-controller="SidebarCtrl as sidebar">
		<li>
			<a ng-href="https://vk.com/" >
				<translate>Моя Страница</translate>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/friends" >
				<translate>Друзья</translate>
				<a class="counter" href="#NewFriends" ng-if="sidebar.stg.counter.friends">
					{{'+'+sidebar.stg.counter.friends}}
				</a>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/albums" >
				<translate>Фотографии</translate>
				<span class="counter" ng-if="sidebar.stg.counter.photos">{{'+'+sidebar.stg.counter.photos}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/video" >
				<translate>Видеозаписи</translate>
				<span class="counter" ng-if="sidebar.stg.counter.videos">{{'+'+sidebar.stg.counter.videos}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/audio" >
				<translate>Аудиозаписи</translate>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/im" >
				<translate>Сообщения</translate>
			</a>
			<a class="counter" href="#NewMess">
				{{sidebar.stg.counter.messages ? '+'+sidebar.stg.counter.messages : '+'}}
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/groups" >
				<translate>Группы</translate>
				<span class="counter" ng-if="sidebar.stg.counter.groups">{{'+'+sidebar.stg.counter.groups}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/feed" >
				<translate>Новости</translate>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/feed?section=comments" >
				<translate>Комментарии</translate>
				<span class="counter" ng-if="sidebar.stg.counter.comments">{{'+'+sidebar.stg.counter.comments}}</span>
			</a>
		</li>
	</aside>

	<div id="friends-online" ng-controller="FriendsCtrl as friend">
		<friend id="user_id" ng-repeat="user_id in friend.stg.friends"></friend>
	</div>
</section>
