var PopupApp;!function(t){function e(){return{link:function(t,e,r){setTimeout(function(){return e.attr("href",r.vkHref)},50)}}}t.vkHrefDirective=e}(PopupApp||(PopupApp={}));var PopupApp;!function(t){function e(){return{templateUrl:"/PopupApp/alert.tpl",replace:!0,scope:{alert:"="},controller:["$scope",function(t){t.close=function(e){e.preventDefault(),t.$emit("onAlertClick",t.alert,!1)}}]}}t.alertDirective=e}(PopupApp||(PopupApp={}));var PopupApp;!function(t){var e=function(){function t(t,e,r,n){var i=this;this.$vk=e,this.storage=r,this.Analytics=n,r.ready.then(function(t){i.stg=t,n.set("&uid",t.user_id),i.deleteAlert()}),t.$on("onAlertClick",function(t,e,r){return i.onAlertClick(e,r)})}return t.prototype.auth=function(){this.Analytics.trackEvent("OAuth","login"),chrome.runtime.reload()},t.prototype.onAlertClick=function(t,e){this.deleteAlert(!0),this.Analytics.trackEvent("Alert",e?"open":"ignore",t.id)},t.prototype.deleteAlert=function(t){t?delete this.stg.alerts[0]:this.stg.alerts[0]||this.stg.alerts.shift(),this.storage.set({alerts:this.stg.alerts})},t.$inject=["$scope","$vk","storage","Analytics"],t}();t.ContainerCtrl=e}(PopupApp||(PopupApp={}));var PopupApp;!function(t){angular.module("PopupApp",["HeaderApp","SectionsApp","gettext","angular-google-analytics"]).config(Helpers.setAnaliticSetting).run(Helpers.setCurrentLanguage).run(["storage",function(t){return t.onChanged(function(e){return angular.forEach(e,function(e,r){return t.stg[r]=angular.copy(e.newValue)})})}]).directive("vkHref",t.vkHrefDirective).directive("alert",t.alertDirective).controller("ContainerCtrl",t.ContainerCtrl).filter("kFilter",function(){return function(t,e){var r=["K","M","G","T","P","E"];if(isNaN(t))return null;if(t<1e3)return t;var n=Math.floor(Math.log(t)/Math.log(1e3));return(t/Math.pow(1e3,n)).toFixed(e)+r[n-1]}})}(PopupApp||(PopupApp={})),angular.module("PopupApp").directive("preloader",function(){return{restrict:"AEC",template:'<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'}});