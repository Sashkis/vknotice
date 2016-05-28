<a class="item flex"  ng-href="https://vk.com/{{user.screen_name}}">
	<img class="ava" ng-src="{{user.photo_100}}" width="50px" height="50px">
	<div class="user flex">
		<strong class="name">{{user.first_name}} {{user.last_name}}</strong>
		<span class="status">{{user.status}}</span>
	</div>
	<div class="fa fa-check" title="{{'Принять'|translate}}"></div>
	<div class="fa fa-times" title="{{'Отклонить'|translate}}"></div>
	<div class="fa fa-ban" title="{{'Заблокировать'|translate}}"></div>
</a>