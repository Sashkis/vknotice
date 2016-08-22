<div id="user-page-root" ng-controller="UserPageCtrl as vm">
	<div class="avatar-container">
		<img ng-src="{{vm.user.photo_100}}" />
	</div>

	<div class="user-info">
		<div class="header">
			<div class="top">
				<a ng-href="https://vk.com/id{{vm.user.id}}">{{vm.user.first_name}} {{vm.user.last_name}}</a>
				<span class="online-status">
					<span ng-if="vm.user.online">Online</span>
					<span ng-if="!vm.user.online">Offline</span>
				</span>
			</div>
			<div class="status">{{vm.user.status}}</div>
		</div>

		<main>
			<item ng-if="vm.user.bdate"><translate class="title">День рождения:</translate><span class="value">{{vm.user.bdate}}</span></item>
			<item ng-if="vm.user.country"><translate class="title">Страна: </translate><span class="value">{{vm.user.country.title}}</span></item>
			<item ng-if="vm.user.city"><translate class="title">Город:</translate><span class="value">{{vm.user.city.title}}</span></item>
			<item ng-if="vm.user.relation">
				<translate class="title">Семейное положение:</translate>

				<span class="value" ng-switch="vm.user.relation">
					<span ng-switch-when="1" ng-switch="vm.user.sex">
						<translate class="value" ng-switch-when="1">не замужем</translate>
						<translate class="value" ng-switch-when="2">не женат</translate>
					</span>

					<span ng-switch-when="2" ng-switch="vm.user.sex">
						<translate class="value" ng-switch-when="1">есть друг</translate>
						<translate class="value" ng-switch-when="2">есть подруга</translate>
					</span>

					<span ng-switch-when="3" ng-switch="vm.user.sex">
						<translate class="value" ng-switch-when="1" ng-if="!vm.user.relation_partner">помолвлена</translate>
						<translate class="value" ng-switch-when="1" ng-if="vm.user.relation_partner">помолвлена c</translate>
						<translate class="value" ng-switch-when="2" ng-if="!vm.user.relation_partner">помолвлен</translate>
						<translate class="value" ng-switch-when="2" ng-if="vm.user.relation_partner">помолвлен c</translate>
					</span>

					<span ng-switch-when="4" ng-switch="vm.user.sex">
						<translate class="value" ng-switch-when="1" ng-if="!vm.user.relation_partner">замужем</translate>
						<translate class="value" ng-switch-when="1" ng-if="vm.user.relation_partner">замужем за</translate>
						<translate class="value" ng-switch-when="2" ng-if="!vm.user.relation_partner">женат</translate>
						<translate class="value" ng-switch-when="2" ng-if="vm.user.relation_partner">женат на</translate>
					</span>

					<span ng-switch-when="5">
						<translate class="value">всё сложно</translate>
					</span>

					<span ng-switch-when="6">
						<translate class="value">в активном поиске</translate>
					</span>

					<span ng-switch-when="7" ng-switch="vm.user.sex">
						<translate class="value" ng-switch-when="1" ng-if="!vm.user.relation_partner">влюблена</translate>
						<translate class="value" ng-switch-when="1" ng-if="vm.user.relation_partner">влюблена в</translate>
						<translate class="value" ng-switch-when="2" ng-if="!vm.user.relation_partner">влюблён</translate>
						<translate class="value" ng-switch-when="2" ng-if="vm.user.relation_partner">влюблён в</translate>
					</span>

					<a
					class="relation_partner"
					ui-sref="user({user_id: vm.user.relation_partner.id})"
					href="https://vk.com/id{{vm.user.relation_partner.id}}"
					vk-href="https://vk.com/id{vm.user.relation_partner.id}}"
					ng-if="vm.user.relation_partner && (vm.user.relation == 3 || vm.user.relation == 4 || vm.user.relation == 7)"
					>
						{{vm.user.relation_partner.first_name}} {{vm.user.relation_partner.last_name}}
					</a>
				</span>
			</item>
		</main>
	</div>
</div>
