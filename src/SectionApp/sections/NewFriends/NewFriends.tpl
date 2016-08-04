<div id="newfriends" ng-controller="NewFriendsCtrl as requests" class="flex">
	<request user-id="{{user_id}}" ng-repeat="user_id in requests.stg.newfriends"></request>

	<div class="empty-requests" ng-if="!requests.stg.newfriends.length">
		<i class="fa fa-user-plus" aria-hidden="true"></i>
		<translate>Нет новых заявок в друзья</translate>
	</div>

</div>
