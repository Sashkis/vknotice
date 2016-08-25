<div id="newfriends" ng-controller="NewFriendsCtrl as vm" class="flex" ng-if="vm.stg.newfriends.length">
	<request user-id="{{user_id}}" ng-repeat="user_id in vm.stg.newfriends"></request>
</div>

<div id="friends-online" class="all" ng-controller="AllFriendsCtrl as vm" class="flex" ng-if="!vm.stg.newfriends.length">
	<div class="preloader" ng-if="!vm.friends"></div>

	<a
		ng-repeat="user in vm.friends"
		class="item"
		title="{{user.first_name}} {{user.last_name}}"
		ui-sref="user({user_id: user.id})"
		href="https://vk.com/id{{user.id}}"
		vk-href="https://vk.com/id{{user.id}}"
	>
		<div class="overlay"><i class="fa fa-user"></i></div>
		<user-ava src="user.photo_50"></user-ava>
		<div class="online-indicator ng-scope" ng-if="user.online"></div>
	</a>
</div>
