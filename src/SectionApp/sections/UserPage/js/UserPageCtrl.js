var SectionsApp;
(function (SectionsApp) {
    var Friend_Status;
    (function (Friend_Status) {
        Friend_Status[Friend_Status["NotFriend"] = 0] = "NotFriend";
        Friend_Status[Friend_Status["OutgoingRequest"] = 1] = "OutgoingRequest";
        Friend_Status[Friend_Status["IncomingRequest"] = 2] = "IncomingRequest";
        Friend_Status[Friend_Status["IsFriend"] = 3] = "IsFriend";
    })(Friend_Status || (Friend_Status = {}));
    var Relation;
    (function (Relation) {
        Relation[Relation["Unknown"] = 0] = "Unknown";
        Relation[Relation["Single"] = 1] = "Single";
        Relation[Relation["InRelationship"] = 2] = "InRelationship";
        Relation[Relation["Engaged"] = 3] = "Engaged";
        Relation[Relation["Married"] = 4] = "Married";
        Relation[Relation["Complicated"] = 5] = "Complicated";
        Relation[Relation["ActivelySearching"] = 6] = "ActivelySearching";
        Relation[Relation["Love"] = 7] = "Love";
    })(Relation || (Relation = {}));
    var UserPageCtrl = (function () {
        function UserPageCtrl($vk, $stateParams) {
            var _this = this;
            this.$vk = $vk;
            $vk.auth().then(function () {
                $vk.api('users.get', {
                    user_ids: $stateParams.user_id,
                    fields: [
                        'bdate',
                        'can_send_friend_request',
                        'can_write_private_message',
                        'city',
                        'counters',
                        'country',
                        'friend_status',
                        'online',
                        'photo_200_orig',
                        'relation',
                        'sex',
                        'status',
                        'verified',
                    ].join(',')
                }).then(function (API) {
                    _this.user = API[0];
                });
            });
        }
        UserPageCtrl.$inject = [
            '$vk',
            '$stateParams'
        ];
        return UserPageCtrl;
    }());
    SectionsApp.UserPageCtrl = UserPageCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=UserPageCtrl.js.map