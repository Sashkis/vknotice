<span ng-switch="attachment.type" class="attachment-{{attachment.type}}">

	<a ng-switch-when="photo" ng-href={{attachment.photo.photo_2560}}>
		<img ng-src="{{attachment.photo.photo_130}}">
	</a>


	<a ng-switch-when="link" ng-href="{{attachment.link.url}}">
		{{attachment.link.title || attachment.link.url}}
	</a>


  <span ng-switch-default>{{attachment}}</span>
	<!-- {{attachment}} -->
</span>
