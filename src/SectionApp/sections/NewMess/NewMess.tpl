<div class="" ng-controller="NewMessCtrl as dialogs">
  <div ng-repeat="dialog in dialogs.stg.dialogs">
    {{dialog.message.body}}
    <br>
  </div>
</div>