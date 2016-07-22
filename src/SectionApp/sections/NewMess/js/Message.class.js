var SectionsApp;
(function (SectionsApp) {
    var Message = (function () {
        function Message(message) {
            angular.extend(this, message);
            if (this.emoji) {
                this.body = new SectionsApp.Emoji().emojiToHTML(this.body);
            }
        }
        return Message;
    }());
    SectionsApp.Message = Message;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=Message.class.js.map