<header ng-controller="HeaderCtrl as head" class="flex">
	<a ng-hide="main.stack.get()" class="navbar-brand" ng-href="https://vk.com/vknotice">
		<span class="fa fa-vk"></span>
		<translate>Информер</translate>
	</a>
	<span ng-show="main.stack.get()" class="navbar-brand" ng-click="main.backSection($event)">
		<span class="fa fa-chevron-left"></span>
		<translate>Назад</translate>
	</span>

	<a ng-class="['notifications', {empty: !head.stg.counter.notifications}]" ng-attr-data-badge="{{head.stg.counter.notifications}}" ng-href="https://vk.com/feed?section=notifications">
		<i class="fa fa-bell"></i>
	</a>

	<span ng-class="['dropdown navbar-right',{open: head.isDropdownOpen}]" ng-click="head.isDropdownOpen = !head.isDropdownOpen">
		<a class="profile">
			{{head.current_user.first_name}}
			<img class="ava" ng-src="{{head.current_user.photo_100}}" width="50px" height="50px">
			<i class="caret"></i>
		</a>

		<ul class="dropdown-menu">
			<li><a href="https://vk.com/vknotice?w=page-90041499_50788371" translate>Задать вопрос</a></li>
			<li><a href="https://vk.com/topic-90041499_31898043" translate>Оставить предложение</a></li>
			<li><a href="https://vk.com/im?sel=-90041499" translate>Сообщить об ошибке</a></li>
			<li class="divider"></li>
			<li><a ng-click="head.trackActivity('share')" ng-href="{{head.shareUrl}}" translate>Рассказать друзьям</a></li>
			<li><a ng-click="head.trackActivity('review')" ng-href="{{head.reviewUrl}}" translate>Оставить отзыв</a></li>
			<li class="divider"></li>
			<li><a ng-href="{{head.optionUrl}}" translate>
				Настройки
			</a></li>
			<li><a href="#" ng-click="head.logout($event)" translate>Выйти</a></li>
		</ul>
	</span>
</header>
