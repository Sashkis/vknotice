var SectionsApp;
(function (SectionsApp) {
    var MessMapService = (function () {
        function MessMapService(storage, $stateParams) {
            var _this = this;
            this.$stateParams = $stateParams;
            this.stg = {};
            storage.ready.then(function (stg) {
                _this.maps = stg.dialogs.map(function (d) { return { peer_id: d.peer_id, isMore: false, items: [] }; });
            });
        }
        MessMapService.prototype.getMessMap = function (peer_id) {
            if (peer_id === void 0) { peer_id = +this.$stateParams.peer_id; }
            if (!peer_id)
                return;
            return this.maps.find(function (d) { return peer_id === d.peer_id; });
        };
        MessMapService.prototype.insertMessages = function (peer_id, messages, prepend, clearBeforInsert) {
            if (prepend === void 0) { prepend = false; }
            if (clearBeforInsert === void 0) { clearBeforInsert = false; }
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
            return targetMessMap.items.length;
        };
        MessMapService.prototype.setMore = function (peer_id, count) {
            var targetMessMap = this.getMessMap(peer_id);
            if (targetMessMap && count && targetMessMap.items.length < count)
                targetMessMap.isMore = true;
        };
        MessMapService.$inject = [
            'storage',
            '$stateParams',
        ];
        return MessMapService;
    }());
    SectionsApp.MessMapService = MessMapService;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=MessMapService.js.map