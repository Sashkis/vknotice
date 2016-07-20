<a ng-href="#NewMess/{{dialog.id}}" class="dialog-item" ng-class="{active: vm.$routeParams.peer_id == dialog.id}">
	<div class="ava-container">
		<img ng-src="{{dialog.profile.photo_100}}" width="36px" height="36px">
	</div>
</a>
