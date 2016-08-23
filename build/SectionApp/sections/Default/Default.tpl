<section class="flex">
	<aside ng-controller="SidebarCtrl as sidebar">
		<li>
			<a ng-href="https://vk.com/id{{sidebar.stg.user_id}}" >
				<i class="left_icon l_pr" aria-hidden="true"></i>
				<translate>Моя Страница</translate>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/feed" >
				<i class="left_icon l_nwsf" aria-hidden="true"></i>
				<translate>Новости</translate>
			</a>
		</li>
		<li>
			<a vk-href="https://vk.com/im" ui-sref="dialogs">
				<i class="left_icon l_msg" aria-hidden="true"></i>
				<translate>Сообщения</translate>
				<span class="counter" ng-if="sidebar.stg.counter.messages">+{{sidebar.stg.counter.messages|kFilter}}</span>
			</a>
		</li>
		<li>
			<a vk-href="https://vk.com/friends" ui-sref="requests">
				<i class="left_icon l_fr" aria-hidden="true"></i>
				<translate>Друзья</translate>
				<span class="counter" ng-if="sidebar.stg.counter.friends">+{{sidebar.stg.counter.friends|kFilter}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/groups" >
				<i class="left_icon l_gr" aria-hidden="true"></i>
				<translate>Группы</translate>
				<span class="counter" ng-if="sidebar.stg.counter.groups">+{{sidebar.stg.counter.groups|kFilter}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/albums" >
				<i class="left_icon l_ph" aria-hidden="true"></i>
				<translate>Фотографии</translate>
				<span class="counter" ng-if="sidebar.stg.counter.photos">+{{sidebar.stg.counter.photos|kFilter}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/audio" >
				<i class="left_icon l_aud" aria-hidden="true"></i>
				<translate>Аудиозаписи</translate>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/video" >
				<i class="left_icon l_vid" aria-hidden="true"></i>
				<translate>Видеозаписи</translate>
				<span class="counter" ng-if="sidebar.stg.counter.videos">+{{sidebar.stg.counter.videos|kFilter}}</span>
			</a>
		</li>
		<li>
			<a ng-href="https://vk.com/apps" >
				<i class="left_icon l_ap" aria-hidden="true"></i>
				<translate>Игры</translate>
			</a>
		</li>
	</aside>

	<div id="friends-online" ng-controller="FriendsCtrl as friend">
		<friend id="user_id" ng-repeat="user_id in friend.stg.friends"></friend>
	</div>
</section>
