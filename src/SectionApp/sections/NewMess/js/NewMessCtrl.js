var SectionsApp;
(function (SectionsApp) {
    var NewMessCtrl = (function () {
        function NewMessCtrl($vk, storage, $stateParams) {
            var _this = this;
            this.$vk = $vk;
            this.storage = storage;
            storage.ready.then(function (stg) { return _this.stg = stg; });
            this.stateParams = $stateParams;
            document.getElementById('dialogs-list').addEventListener("mousewheel", function (e) { return _this.onMousewheel(e); }, false);
            ;
        }
        NewMessCtrl.prototype.markAsRead = function (peer_id) {
            var _this = this;
            this.$vk.auth().then(function () {
                _this.$vk.api('messages.markAsRead', {
                    access_token: _this.$vk.stg.access_token,
                    peer_id: peer_id,
                });
            });
        };
        NewMessCtrl.prototype.onMousewheel = function ($event) {
            var dialogsList = document.getElementById('dialogs-list');
            if (!dialogsList)
                return;
            var bottom = $event.deltaY > 0;
            var scroller = document.getElementsByClassName('scroller')[0];
            var topLimit = 0;
            var bottomLimit = -scroller.offsetHeight + dialogsList.offsetHeight;
            var currentScroll = parseInt(scroller.style.marginTop || '0');
            var scrollTo = currentScroll + (bottom ? -48 : 48);
            if (scrollTo <= bottomLimit) {
                scrollTo = bottomLimit;
                dialogsList.classList.remove('can-move-bottom');
            }
            else
                dialogsList.classList.add('can-move-bottom');
            if (scrollTo >= topLimit) {
                scrollTo = topLimit;
                dialogsList.classList.remove('can-move-top');
            }
            else
                dialogsList.classList.add('can-move-top');
            scroller.style.marginTop = scrollTo + "px";
        };
        NewMessCtrl.$inject = [
            '$vk',
            'storage',
            '$stateParams'
        ];
        return NewMessCtrl;
    }());
    SectionsApp.NewMessCtrl = NewMessCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=NewMessCtrl.js.map