var SectionsApp;
(function (SectionsApp) {
    var MessMapService = (function () {
        function MessMapService(storage, $routeParams) {
            var _this = this;
            this.$routeParams = $routeParams;
            this.stg = {};
            storage.ready.then(function (stg) {
                _this.maps = stg.dialogs.map(function (d) { return { peer_id: d.peer_id, isMore: false, items: [] }; });
            });
        }
        MessMapService.prototype.getMessMap = function (peer_id) {
            if (peer_id === void 0) { peer_id = +this.$routeParams.peer_id; }
            if (!peer_id)
                return;
            return this.maps.find(function (d) { return peer_id === d.peer_id; });
        };
        MessMapService.prototype.insertMessages = function (peer_id, messages, clearBeforInsert, prepend) {
            if (clearBeforInsert === void 0) { clearBeforInsert = true; }
            if (prepend === void 0) { prepend = false; }
            var targetMessMap = this.getMessMap(peer_id);
            if (!targetMessMap)
                return;
            messages = messages.map(function (m) { return new SectionsApp.Message(m); });
            if (clearBeforInsert) {
                targetMessMap.items = [];
            }
            if (!prepend)
                targetMessMap.items = targetMessMap.items.concat(messages);
            else
                targetMessMap.items = messages.concat(targetMessMap.items);
            console.log(this.maps);
            return targetMessMap.items.length;
        };
        MessMapService.prototype.setMore = function (peer_id, count) {
            var targetMessMap = this.getMessMap(peer_id);
            if (targetMessMap && count && targetMessMap.items.length < count)
                targetMessMap.isMore = true;
        };
        MessMapService.$inject = [
            'storage',
            '$routeParams',
        ];
        return MessMapService;
    }());
    SectionsApp.MessMapService = MessMapService;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=MessMapService.js.map