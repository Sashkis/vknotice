<a
	class="item"
	title="{{user.first_name}} {{user.last_name}}"
	ui-sref="dialogs.chat({peer_id: user.id})"
	href="https://vk.com/im?sel={{user.id}}"
	vk-href="https://vk.com/im?sel={{user.id}}"
>
	<div class="online-indicator ng-scope" ng-if="user.online"></div>
	<user-ava src="user.photo_50"></user-ava>
</a>
