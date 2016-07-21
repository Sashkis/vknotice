<div id="newmess" ng-controller="NewMessCtrl as vm">

  <div id="dialogs-list">
    <vk-dialog ng-repeat="dialog in vm.stg.dialogs"></vk-dialog>
  </div>

	<div id="messages-list" ng-if="vm.currentDialog" ng-scrollbar rebuild-on="messagesLoad">
		<div
			id="message-{{message.id}}"
			class="message-item-container"
			ng-class="{out: message.out, unread: !message.read_state}"
			ng-repeat="message in vm.currentDialog.message"
			>
			<div class="message-item">
				{{message.body}}
			</div>
			<div class="message-date">
				{{message.date*1000 | date:'HH:mm'}}
			</div>
		</div>
	</div>
</div>
