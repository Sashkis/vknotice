<div id="newmess" ng-controller="NewMessCtrl as vm">

  <div id="dialogs-list">
    <vk-dialog ng-repeat="dialog in vm.dialogs"></vk-dialog>
  </div>

	<div id="messages-list" ng-if="vm.getCurrentDialog()">
		<div class="" ng-repeat="message in vm.getCurrentDialog().message">
			{{message.body}}
		</div>
	</div>
</div>
