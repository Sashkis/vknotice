<div id="newmess" ng-controller="NewMessCtrl as vm">

  <div id="dialogs-list">
    <vk-dialog ng-repeat="dialog in vm.stg.dialogs"></vk-dialog>
  </div>

	<div class="flex messages-list-container" ng-if="vm.currentDialog">
		<div id="messages-list" ng-scrollbar rebuild-on="messagesLoad">
			<div ng-repeat="message in vm.currentDialog.message track by message.id">
				<div id="message-{{message.id}}" class="message-item-container" ng-class="{out: message.out, unread: !message.read_state}">
					<div user-ava profile-id="message.from_id" ng-if="vm.currentDialog.type === 1 && message.out === 0 && message.from_id !== vm.currentDialog.message[$index+1].from_id"></div>
					<div class="space" ng-if="vm.currentDialog.type === 1 && message.out === 0 && message.from_id === vm.currentDialog.message[$index+1].from_id"></div>
					<div class="message-item">
						<b user-name profile-id="message.from_id" ng-if="vm.currentDialog.type === 1 && message.out === 0 && message.from_id !== vm.currentDialog.message[$index+1].from_id"></b>
						<span ng-bind-html="message.body | linkify | emoji"></span>
						<br>
						<attachment ng-repeat="attachment in message.attachments"></attachment>
					</div>
					<div class="message-date">
						{{message.date*1000 | date:'HH:mm'}}
					</div>
				</div>
			</div>
		</div>

		<form class="sendMess" ng-submit="vm.sendMessage()">
			<input type="text" ng-model="vm.message" placeholder="Введите ваше сообщение" autofocus>
			<button type="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
		</form>

	</div>
	<div class="empty-messages-list-container" ng-if="!vm.currentDialog">
		<i class="fa fa-comments" aria-hidden="true"></i>
		<translate>Пожалуйста, выберите диалог</translate>
	</div>
</div>
