<div id="newmess" ng-controller="NewMessCtrl as vm">

  <div id="dialogs-list">
    <vk-dialog ng-repeat="dialog in vm.stg.dialogs"></vk-dialog>
  </div>

	<div class="flex messages-list-container" ng-if="vm.currentDialog">
		<div id="messages-list">
			<message ng-repeat="message in vm.currentDialog.message track by message.id"></message>
		</div>

		<form class="sendMess" ng-submit="vm.sendMessage()">
			<input type="text" ng-model="vm.message" placeholder="{{'Введите ваше сообщение'|translate}}" autofocus>
			<button type="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
		</form>

	</div>
	<div class="empty-messages-list-container" ng-if="!vm.currentDialog">
		<i class="fa fa-comments" aria-hidden="true"></i>
		<translate>Пожалуйста, выберите диалог</translate>
	</div>
</div>
