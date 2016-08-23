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
            this.$stateParams = $stateParams;
            $vk.auth().then(function () { return _this.updateUser(); });
        }
        UserPageCtrl.prototype.action = function (method, user_id) {
            var _this = this;
            if (method === 'ban')
                method = 'account.banUser';
            else
                method = "friends." + method;
            this.$vk.api(method, {
                access_token: this.$vk.stg.access_token,
                user_id: user_id
            })
                .then(function () { return _this.updateUser(); });
        };
        UserPageCtrl.prototype.updateUser = function (user_id) {
            var _this = this;
            if (user_id === void 0) { user_id = this.$stateParams.user_id; }
            return this.$vk.api('users.get', {
                access_token: this.$vk.stg.access_token,
                user_ids: user_id,
                fields: [
                    'bdate',
                    'can_send_friend_request',
                    'can_write_private_message',
                    'city',
                    'counters',
                    'country',
                    'friend_status',
                    'online',
                    'photo_100',
                    'photo_max_orig',
                    'relation',
                    'sex',
                    'status',
                    'verified',
                ].join(',')
            }).then(function (API) {
                _this.user = API[0];
                if (_this.user.sex === 0)
                    _this.user.sex = 1;
                if (_this.user.bdate) {
                    var _a = _this.user.bdate.split('.'), bday = _a[0], bmonth = _a[1], byear = _a[2];
                    _this.user.bdate_obj = { bday: bday, bmonth: bmonth, byear: byear };
                }
                console.log(_this.user);
                return API;
            });
        };
        UserPageCtrl.$inject = [
            '$vk',
            '$stateParams'
        ];
        return UserPageCtrl;
    }());
    SectionsApp.UserPageCtrl = UserPageCtrl;
})(SectionsApp || (SectionsApp = {}));
//# sourceMappingURL=UserPageCtrl.js.map