<a
	class="dialog-item"
	ng-class="{active: vm.stateParams.peer_id == dialog.peer_id}"
	data-title="{{dialog.title || dialog.profiles[0].first_name || dialog.profiles[0].name || ''}}"
	ng-href="{{dialog.url}}"
	ui-sref=".chat({peer_id: dialog.peer_id})"
>
	<div class="unread" ng-if="dialog.unread">{{dialog.unread}}</div>
	<div class="marlAsRead" ng-click="vm.markAsRead(dialog.peer_id)"><i class="fa fa-eye"></i></div>
	<div
		class="ava-container"
		ng-class="['ava-count-'+ (dialog.photo_50 ? 1 : dialog.profiles.length),
		         {online: dialog.profiles.length === 1 && dialog.profiles[0].online === 1}]"
	>
		<img ng-if="!dialog.photo_50" ng-repeat="profile in dialog.profiles" ng-src="{{profile.photo_50}}" width="36px" height="36px">
		<img ng-if="dialog.photo_50" ng-src="{{dialog.photo_50}}" width="36px" height="36px">
	</div>
</a>
