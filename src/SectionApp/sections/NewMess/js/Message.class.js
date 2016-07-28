var SectionsApp;
(function (SectionsApp) {
    var Message = (function () {
        function Message(message) {
            angular.extend(this, message);
            if (angular.isArray(this.fwd_messages)) {
                if (!this.attachments)
                    this.attachments = [];
                this.attachments.push({
                    type: 'fwd_messages',
                    fwd_messages: {
                        items: this.fwd_messages
                    }
                });
                delete this.fwd_messages;
            }
        }
        return Message;
    }());
    SectionsApp.Message = Message;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=Message.class.js.map