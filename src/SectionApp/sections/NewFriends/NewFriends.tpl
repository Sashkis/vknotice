<div id="newfriends" ng-controller="NewFriendsCtrl as requests" class="flex">
	<div ng-if="requests.stg.newfriends.length > 0" class="bordered">
		<a ng-click="requests.mark($event, 'deleteAll')"><i class="fa fa-times"></i> <translate>Отклонить все</translate></a>
	</div>
	<request user-id="{{user_id}}" ng-repeat="user_id in requests.stg.newfriends"></request>
</div>