var VkApp;!function(e){var t=function(){function e(e,t,r,s,o,i){this.$q=e,this.$http=t,this.storage=r,this.apiConfig=s,this.authConfig=o,this.stg={},this.authUrl="https://oauth.vk.com/authorize?"+i(o)}return e.prototype.isAuth=function(){var e=this,t=this.$q.defer();return this.stg.access_token&&this.stg.user_id?this.api("users.get",{access_token:this.stg.access_token}).then(function(r){t.resolve(r&&r[0]&&r[0].id&&r[0].id==e.stg.user_id)},function(){t.resolve(!1)}):t.resolve(!1),t.promise},e.prototype.parseHashParams=function(e){for(var t={},r=e.split("#")[1].split("&"),s=r.length;s--;)if(r[s]){var o=r[s].split("=");t[o[0]]=o[1]}return t},e.prototype.isAuthSuccess=function(e){return void 0===e&&(e={}),e&&e.user_id&&e.access_token&&e.state&&"vknotice"===e.state},e.prototype.auth=function(){var e=this,t=this.$q.defer();return this.storage.ready.then(function(r){e.stg=r,e.isAuth().then(function(r){r?t.resolve():(e.storage.set({user_id:0,access_token:""}),chrome.tabs.create({url:e.authUrl,active:!0},function(r){var s=r.id,o=function(t,r){if(s&&s===t&&r.url&&r.url.indexOf("oauth.vk.com/blank.html")>-1){var i=e.parseHashParams(r.url);if(!e.isAuthSuccess(i))return;e.storage.set({user_id:+i.user_id,access_token:i.access_token}),!!s&&chrome.tabs.remove(s),chrome.tabs.onUpdated.removeListener(o)}},i=function(r){s===r&&e.isAuth().then(function(e){t[e?"resolve":"reject"](),chrome.tabs.onRemoved.removeListener(i)})};chrome.tabs.onUpdated.addListener(o),chrome.tabs.onRemoved.addListener(i)}))})}),t.promise},e.prototype.api=function(e,t){var r=this;void 0===t&&(t={});var s=this.$q.defer();return t.v=this.apiConfig.version,this.$http.get("https://api.vk.com/method/"+e,{params:t,timeout:4e3,cache:!1}).then(function(o){r.isResponseSuccess(o.data)?s.resolve(o.data.response):o.data.error&&6===o.data.error.error_code?(console.warn("Wait to restart"),setTimeout(function(){console.warn("Restart"),r.api(e,t).then(s.resolve,s.reject)},2e3)):(console.error(o.data.error),s.reject("api_error"))},function(e){console.error(e),s.reject("connect_error")}),s.promise},e.prototype.isResponseSuccess=function(e){return angular.isDefined(e.response)},e.$inject=["$q","$http","storage","apiConfig","authConfig","$httpParamSerializer"],e}();e.VkService=t}(VkApp||(VkApp={}));var VkApp;!function(e){var t="5.53";angular.module("VkApp",["StorageApp"]).constant("apiConfig",{version:t}).constant("authConfig",{redirect_uri:"https://oauth.vk.com/blank.html",client_id:4682781,scope:"offline,friends,messages,notifications,wall",response_type:"token",display:"popup",v:t,state:"vknotice"}).service("$vk",e.VkService)}(VkApp||(VkApp={}));