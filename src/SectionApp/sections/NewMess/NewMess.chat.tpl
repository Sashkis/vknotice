
	<div id="messages-list">
		<div class="preloader" ng-if="!vm.currentMessMap.items || vm.currentMessMap.items.length < 1"></div>
		<message ng-repeat="message in vm.currentMessMap.items track by message.id"></message>
		<div ng-if="vm.currentMessMap.isMore" class="loadMore"><button ng-click="vm.loadMore(vm.currentMessMap.peer_id)">Загрузить ещё</button></div>
	</div>

	<form class="sendMess" ng-submit="vm.sendMessage()">
		<input type="text" ng-model="vm.message" placeholder="{{'Введите ваше сообщение'|translate}}" autofocus>
		<button type="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
	</form>
