var PopupApp;!function(t){var n=function(){function t(t,n,e){var r=this;this.$vk=t,this.storage=n,this.Analytics=e,n.ready.then(function(t){return r.stg=t})}return t.prototype.isAuth=function(){return!!(this.$vk.stg&&this.$vk.stg.access_token&&this.$vk.stg.user_id)},t.prototype.auth=function(){this.Analytics.trackEvent("OAuth","login"),chrome.runtime.reload()},t.$inject=["$vk","storage","Analytics"],t}();t.ContainerCtrl=n}(PopupApp||(PopupApp={}));var PopupApp;!function(t){angular.module("PopupApp",["HeaderApp","SectionsApp","gettext","angular-google-analytics"]).config(["AnalyticsProvider",Helpers.setAnaliticSetting]).run(["gettextCatalog","storage",Helpers.setCurrentLanguage]).run(["storage",function(t){return t.onChanged(function(n){return angular.forEach(n,function(n,e){return t.stg[e]=angular.copy(n.newValue)})})}]).controller("ContainerCtrl",t.ContainerCtrl)}(PopupApp||(PopupApp={})),angular.module("PopupApp").directive("preloader",function(){return{restrict:"AEC",template:'<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'}});