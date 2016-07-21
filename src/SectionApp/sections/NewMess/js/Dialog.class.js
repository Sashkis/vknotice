var SectionsApp;
(function (SectionsApp) {
    (function (DialogType) {
        DialogType[DialogType["User"] = 0] = "User";
        DialogType[DialogType["Chat"] = 1] = "Chat";
        DialogType[DialogType["Group"] = 2] = "Group";
    })(SectionsApp.DialogType || (SectionsApp.DialogType = {}));
    var DialogType = SectionsApp.DialogType;
    var Dialog = (function () {
        function Dialog(dialog) {
            this.unread = 0;
            this.profiles = [];
            this.in_read = dialog.in_read;
            this.out_read = dialog.out_read;
            if (dialog.message.chat_id) {
                this.title = dialog.message.title;
                this.type = DialogType.Chat;
                this.peer_id = 2000000000 + dialog.message.chat_id;
                if (dialog.message.chat_active && angular.isArray(dialog.message.chat_active))
                    this.profiles = dialog.message.chat_active.slice(0, 4);
            }
            else {
                this.peer_id = dialog.message.user_id;
                this.type = this.peer_id > 0 ? DialogType.User : DialogType.Group;
                this.profiles = [dialog.message.user_id];
            }
        }
        return Dialog;
    }());
    SectionsApp.Dialog = Dialog;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=Dialog.class.js.map