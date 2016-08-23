<a class="item flex bordered" ui-sref="user({user_id: user.id})" vk-href="https://vk.com/id{{user.id}}">
	<img class="ava" ng-src="{{user.photo_50}}" width="50px" height="50px">
	<div class="user flex">
		<strong class="name">{{user.first_name}} {{user.last_name}}</strong>
		<span class="status">{{user.status}}</span>
	</div>
	<div class="fa fa-check" title="{{'Принять'|translate}}" ng-click="requests.mark($event, 'add', user.id)"></div>
	<div class="fa fa-times" title="{{'Отклонить'|translate}}" ng-click="requests.mark($event, 'delete', user.id)"></div>
	<div class="fa fa-ban" title="{{'Заблокировать'|translate}}" ng-click="requests.mark($event, 'ban', user.id)"></div>
</a>
