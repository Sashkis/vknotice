var SectionsApp;!function(e){function t(e){function t(t){return"object"==typeof t?t:e.getProfile(t)}return{templateUrl:"/SectionApp/sections/NewMess/dialog.tpl",replace:!0,link:function(e){e.dialog=angular.copy(e.dialog),e.dialog.profiles=e.dialog.profiles.map(t)}}}e.DialogDirective=t,t.$inject=["storage"]}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(){this.emojiCharSeq=/[0-9\uD83D\uD83C]/,this.emojiRegEx=/((?:[\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g,this.pathToEmojisImages="https://vk.com/images/emoji/"}return e.prototype.getEmojiHTML=function(e,t){return'<img class="emoji" '+(t?'alt="'+t+'"':"")+' src="'+this.pathToEmojisImages+e+'.png" />'},e.prototype.emojiToHTML=function(e){var t=this,s={D83DDE07:/(\s|^)([0OО]:\))([\s\.,]|$)/g,D83DDE09:/(\s|^)(;-\)+)([\s\.,]|$)/g,D83DDE06:/(\s|^)([XХxх]-?D)([\s\.,]|$)/g,D83DDE0E:/(\s|^)(B-\))([\s\.,]|$)/g,D83DDE0C:/(\s|^)(3-\))([\s\.,]|$)/g,D83DDE20:/(\s|^)(&gt;\()([\s\.,]|$)/g,D83DDE30:/(\s|^)(;[oоOО])([\s\.,]|$)/g,D83DDE33:/(\s|^)(8\|)([\s\.,]|$)/g,D83DDE32:/(\s|^)(8-?[oоOО])([\s\.,]|$)/g,D83DDE0D:/(\s|^)(8-\))([\s\.,]|$)/g,D83DDE37:/(\s|^)(:[XХ])([\s\.,]|$)/g,D83DDE28:/(\s|^)(:[oоOО])([\s\.,]|$)/g,2764:/(\s|^)(&lt;3)([\s\.,]|$)/g,D83DDE0A:/(:-\))([\s\.,]|$)/g,D83DDE03:/(:-D)([\s\.,]|$)/g,D83DDE1C:/(;-[PР])([\s\.,]|$)/g,D83DDE0B:/(:-[pр])([\s\.,]|$)/g,D83DDE12:/(:-\()([\s\.,]|$)/g,"263A":/(:-?\])([\s\.,]|$)/g,D83DDE0F:/(;-\])([\s\.,]|$)/g,D83DDE14:/(3-?\()([\s\.,]|$)/g,D83DDE22:/(:&#039;\()([\s\.,]|$)/g,D83DDE2D:/(:_\()([\s\.,]|$)/g,D83DDE29:/(:\(\()([\s\.,]|$)/g,D83DDE10:/(:\|)([\s\.,]|$)/g,D83DDE21:/(&gt;\(\()([\s\.,]|$)/g,D83DDE1A:/(:-\*)([\s\.,]|$)/g,D83DDE08:/(\}:\))([\s\.,]|$)/g,D83DDC4D:/(:like:)([\s\.,]|$)/g,D83DDC4E:/(:dislike:)([\s\.,]|$)/g,"261D":/(:up:)([\s\.,]|$)/g,"270C":/(:v:)([\s\.,]|$)/g,D83DDC4C:/(:ok:|:ок:)([\s\.,]|$)/g};for(var n in s)e.indexOf(n)>-1&&(e=e.replace(s[n],this.getEmojiHTML(n)));return e.replace(this.emojiRegEx,function(e){return t.emojiReplace(e)}).replace(/\uFE0F/g,"")},e.prototype.emojiReplace=function(e){for(var t="",s="",n=!1,i=!1,r="",o=[],a=[],c=0;c<e.length;c++){var p=e.charCodeAt(c),u=p.toString(16).toUpperCase(),l=e.charAt(c);1!==c||8419!==p?(t+=u,s+=l,l.match(this.emojiCharSeq)||(a.push(t),o.push(s),t="",s="")):(a.push("003"+e.charAt(0)+"20E3"),o.push(e.charAt(0)),t="",s="")}t&&(a.push(t),o.push(s)),t="",s="";for(var c=0;c<a.length;c++){var u=a[c],l=o[c];if(l.match(/\uD83C[\uDFFB-\uDFFF]/))t+=u,s+=l;else if(n)t+=u,s+=l,n=!1;else{if("200C"===u||"200D"===u){if(t){n=!0;continue}r+=l}if(l.match(/\uD83C[\uDDE6-\uDDFF]/)){if(i){t+=u,s+=l,i=!1;continue}i=!0}else i&&(i=!1);t&&(r+=this.getEmojiHTML(t,s)),t=u,s=l}}return t&&(r+=this.getEmojiHTML(t,s)),r},e}();e.Emoji=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){function t(){return{templateUrl:"/SectionApp/sections/NewMess/attachment.tpl",replace:!0}}e.AttachmentDirective=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){function t(e){function t(t){return"object"==typeof t?t:e.getProfile(t)}return{template:'<img class="ava" ng-src="{{src}}">',scope:{profileId:"=?",src:"=?"},link:function(e){if(!e.src&&e.profileId){var s=t(e.profileId);s.photo_50&&(e.src=s.photo_50)}}}}e.userAvaDirective=t,t.$inject=["storage"]}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){function t(e){function t(t){return"object"==typeof t?t:e.getProfile(t)}return{template:'{{profile.name || profile.first_name+" "+profile.last_name}}',scope:{profileId:"="},link:function(e){e.profile=t(e.profileId)}}}e.userNameDirective=t,t.$inject=["storage"]}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){function t(){return{templateUrl:"/SectionApp/sections/NewMess/message.tpl",replace:!1}}e.MessageDirective=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e){angular.extend(this,e),angular.isArray(this.fwd_messages)&&(this.attachments||(this.attachments=[]),this.attachments.push({type:"fwd_messages",fwd_messages:{items:this.fwd_messages}}),delete this.fwd_messages)}return e}();e.Message=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function t(e,t){var s=this;this.$stateParams=t,this.stg={},e.ready.then(function(e){s.maps=e.dialogs.map(function(e){return{peer_id:e.peer_id,isMore:!1,items:[]}})})}return t.prototype.getMessMap=function(e){if(void 0===e&&(e=+this.$stateParams.peer_id),e){var t=this.maps.find(function(t){return e===t.peer_id});return t||(t={peer_id:e,isMore:!1,items:[]},this.maps.push(t)),t}},t.prototype.insertMessages=function(t,s,n,i){void 0===n&&(n=!1),void 0===i&&(i=!1);var r=this.getMessMap(t);if(r){return i&&(r.items=[]),s=s.map(function(t){return new e.Message(t)}),(o=r.items)[n?"unshift":"push"].apply(o,s);var o}},t.prototype.setMore=function(e,t){var s=this.getMessMap(e);s&&t&&s.items.length<t&&(s.isMore=!0)},t.$inject=["storage","$stateParams"],t}();e.MessMapService=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e,t,s,n,i,r){var o=this;this.storage=e,this.$vk=t,this.$scope=s,this.deamon=n,this.messMap=i,this.$stateParams=r,this.isMore=!1,e.ready.then(function(e){if(o.currentMessMap=i.getMessMap(),o.currentMessMap){var r=o.currentMessMap.peer_id;t.auth().then(function(){o.loadMore(r).then(function(e){o.LongPollParams={access_token:t.stg.access_token,ts:e.server.ts,pts:e.server.pts,fields:"screen_name,status,photo_50,online"},n.setConfig({method:"messages.getLongPollHistory",params:o.LongPollParams,interval:1e3,DoneCB:function(e){return o.onLongPollDone(e)}}).start(),s.$on("$destroy",function(){n.stop()}),s.$on("$stateChangeSuccess",function(e,t,s){o.currentMessMap=i.getMessMap(+s.peer_id),s.peer_id&&o.loadMore(+s.peer_id)})})})}})}return e.prototype.isGroup=function(){var e=+this.$stateParams.peer_id;if(!e)return!1;var t=this.storage.stg.dialogs.find(function(t){return t.peer_id===e});return!!t&&1===t.type},e.prototype.loadHistory=function(e,t,s){return void 0===t&&(t=0),void 0===s&&(s=20),this.$vk.api("execute.getHistory",{access_token:this.$vk.stg.access_token,peer_id:e,count:s,offset:t})},e.prototype.loadMore=function(e){var t=this,s=this.messMap.getMessMap(e),n=s&&s.items?s.items.length:0;return this.loadHistory(e,n).then(function(s){return t.storage.setProfiles(s.profiles),t.messMap.insertMessages(e,s.history.items),t.messMap.setMore(e,s.history.count),s})},e.prototype.onLongPollDone=function(e){var t=this;return this.LongPollParams.pts=e.new_pts,angular.isArray(e.profiles)&&this.storage.setProfiles(e.profiles),!this.currentMessMap||(angular.forEach(e.history,function(s){switch(s[0]){case 4:var n=(s[0],s[1]),i=(s[2],s[3]),r=e.messages.items.find(function(e){return e.id===n});t.messMap.insertMessages(i,[r],!0);break;case 6:case 7:var o=s[0],i=s[1],a=s[2],c=t.messMap.getMessMap(i);c&&c.items.filter(function(e){return e.out===(6===o?0:1)&&e.id<=a}).map(function(e){return e.read_state=1})}}),!0)},e.prototype.sendMessage=function(e){var t=this;if(this.currentMessMap&&this.message){if(e.ctrlKey)return void(this.message+="\n");e.preventDefault();var s=this.currentMessMap.peer_id,n=this.message;this.$vk.auth().then(function(){return t.$vk.api("messages.send",{access_token:t.$vk.stg.access_token,message:n,peer_id:s})}).then(function(e){t.message=""})}},e.$inject=["storage","$vk","$scope","deamon","messMap","$stateParams"],e}();e.ChatCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e,t,s){var n=this;this.$vk=e,this.storage=t,t.ready.then(function(e){return n.stg=e}),this.stateParams=s,document.getElementById("dialogs-list").addEventListener("mousewheel",function(e){return n.onMousewheel(e)},!1)}return e.prototype.markAsRead=function(e){var t=this;this.$vk.auth().then(function(){t.$vk.api("messages.markAsRead",{access_token:t.$vk.stg.access_token,peer_id:e})})},e.prototype.onMousewheel=function(e){var t=document.getElementById("dialogs-list");if(t){var s=e.deltaY>0,n=document.getElementsByClassName("scroller")[0],i=0,r=-n.offsetHeight+t.offsetHeight,o=parseInt(n.style.marginTop||"0"),a=o+(s?-48:48);a<=r?(a=r,t.classList.remove("can-move-bottom")):t.classList.add("can-move-bottom"),a>=i?(a=i,t.classList.remove("can-move-top")):t.classList.add("can-move-top"),n.style.marginTop=a+"px"}},e.$inject=["$vk","storage","$stateParams"],e}();e.NewMessCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e){var t=this;e.ready.then(function(e){t.stg=e})}return e.$inject=["storage"],e}();e.SidebarCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e){var t=this;e.ready.then(function(s){var n=angular.copy(s.friends);t.friends={count:n.count,items:n.items.map(function(t){return e.getProfile(t)})}})}return e.$inject=["storage"],e}();e.FriendsCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t;!function(e){e[e.NotFriend=0]="NotFriend",e[e.OutgoingRequest=1]="OutgoingRequest",e[e.IncomingRequest=2]="IncomingRequest",e[e.IsFriend=3]="IsFriend"}(t||(t={}));var s;!function(e){e[e.Unknown=0]="Unknown",e[e.Single=1]="Single",e[e.InRelationship=2]="InRelationship",e[e.Engaged=3]="Engaged",e[e.Married=4]="Married",e[e.Complicated=5]="Complicated",e[e.ActivelySearching=6]="ActivelySearching",e[e.Love=7]="Love"}(s||(s={}));var n=function(){function e(e,t){var s=this;this.$vk=e,this.$stateParams=t,e.auth().then(function(){return s.updateUser()})}return e.prototype.action=function(e,t){var s=this;e="ban"===e?"account.banUser":"friends."+e,this.$vk.api(e,{access_token:this.$vk.stg.access_token,user_id:t}).then(function(){return s.updateUser()})},e.prototype.updateUser=function(e){var t=this;return void 0===e&&(e=this.$stateParams.user_id),this.$vk.api("users.get",{access_token:this.$vk.stg.access_token,user_ids:e,fields:["bdate","can_send_friend_request","can_write_private_message","city","counters","country","friend_status","online","photo_100","photo_max_orig","relation","sex","status","verified"].join(",")}).then(function(e){if(t.user=e[0],0===t.user.sex&&(t.user.sex=1),t.user.bdate){var s=t.user.bdate.split("."),n=s[0],i=s[1],r=s[2];t.user.bdate_obj={bday:n,bmonth:i,byear:r}}return e})},e.$inject=["$vk","$stateParams"],e}();e.UserPageCtrl=n}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e,t){var s=this;this.storage=e,this.$vk=t,e.ready.then(function(e){s.stg=e})}return e.$inject=["storage"],e}();e.TabCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){function t(e){return{restrict:"E",replace:!1,templateUrl:"../SectionApp/sections/Friends/request.tpl",scope:!0,link:function(t,s,n){t.user=e.getProfile(+n.userId)}}}e.RequestDirective=t,t.$inject=["storage"]}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e,t){var s=this;this.storage=e,this.$vk=t,e.ready.then(function(e){s.stg=e})}return e.prototype.mark=function(e,t,s){var n=this;e.preventDefault();var i;switch(t){case"add":i="friends.add";break;case"delete":i="friends.delete";break;case"ban":i="account.banUser";break;default:i=""}i&&this.$vk.auth().then(function(){n.$vk.api(i,{user_id:s,access_token:n.$vk.stg.access_token})})},e.$inject=["storage","$vk"],e}();e.NewFriendsCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){var t=function(){function e(e,t,s,n){var i=this;this.storage=e,history.pushState({},"home","/PopupApp/popup.html#/"),e.ready.then(function(e){s.go(e.state.name,e.state.params)}),n.$on("$stateChangeSuccess",function(e,t,s){return i.saveSection(t,s)})}return e.prototype.saveSection=function(e,t){this.storage.set({state:{name:e.name,params:t}})},e.$inject=["storage","Analytics","$state","$scope"],e}();e.SectionsCtrl=t}(SectionsApp||(SectionsApp={}));var SectionsApp;!function(e){angular.module("SectionsApp",["VkApp","StorageApp","ui.router","DeamonApp","focus-if","monospaced.elastic"]).config(["$stateProvider","$urlRouterProvider","AnalyticsProvider",function(e,t,s){s.trackPrefix("/Popup").setPageEvent("$stateChangeSuccess"),t.otherwise("/"),e.state("home",{url:"/",templateUrl:"/SectionApp/sections/Default/Default.tpl"}).state("friends",{url:"/friends",templateUrl:"/SectionApp/sections/Friends/tabs.tpl",abstract:!0}).state("friends.all",{url:"/all",templateUrl:"/SectionApp/sections/Friends/all.tpl"}).state("friends.requests",{url:"/requests",templateUrl:"/SectionApp/sections/Friends/requests.tpl"}).state("dialogs",{url:"/dialogs",templateUrl:"/SectionApp/sections/NewMess/NewMess.tpl"}).state("dialogs.chat",{url:"/{peer_id}",templateUrl:"/SectionApp/sections/NewMess/NewMess.chat.tpl"}).state("user",{url:"/user/{user_id}",templateUrl:"/SectionApp/sections/UserPage/UserPage.tpl"})}]).directive("userAva",e.userAvaDirective).directive("userName",e.userNameDirective).directive("vkDialog",e.DialogDirective).directive("vkMessage",e.MessageDirective).directive("attachment",e.AttachmentDirective).directive("request",e.RequestDirective).filter("emoji",["$sce",function(t){return function(s){return t.trustAsHtml((new e.Emoji).emojiToHTML(s))}}]).filter("linkify",function(){return function(e){return linkifyStr(e,{format:function(e,t){return"url"===t&&e.length>40&&(e=e.slice(0,25)+"…"),e}})}}).service("messMap",e.MessMapService).controller("UserPageCtrl",e.UserPageCtrl).controller("SidebarCtrl",e.SidebarCtrl).controller("FriendsCtrl",e.FriendsCtrl).controller("ChatCtrl",e.ChatCtrl).controller("NewMessCtrl",e.NewMessCtrl).controller("SectionsCtrl",e.SectionsCtrl).controller("TabCtrl",e.TabCtrl).controller("NewFriendsCtrl",e.NewFriendsCtrl)}(SectionsApp||(SectionsApp={}));