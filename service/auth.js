const {Logger, Assure} = require("../helper/Ally");
const Identifier = require("../helper/Identifier")


const TOKEN = 'token';
const NO_LOGIN = 'NO_LOGIN';
const _30MIN = 1000 * 60 * 30;
const TOKEN_OPTS = {
    httpOnly: true,
    maxAge: _30MIN,
};


/*

 */
module.exports = function () {

    return {

        req: null,
        res: null,
        dbg: 0,


        /**
         *
         * @param req
         * @param res
         */
        init: function (req, res) {
            this.req = req;
            this.res = res;
        },


        /**
         *
         * @param profile
         * @param req
         * @param res
         * @returns {boolean}
         */
        register: function (profile, req, res) {
            let token;
            try {

                this.init(req, res);

                token = this._createToken(profile);
                Assure('USER TOKEN CREATED', !!token)

                this._setCookie(Identifier.base64(token))

                return true;

            } catch (err) {
                Logger(err, {token})
                return false;
            }
        },


        /**
         *
         * @param req
         * @param res
         * @returns {boolean}
         */
        verify: function (req, res) {
            let valB64, val, ckId, ckEmail, ckRole, expires, ckIdentifier, identifier, token, userProfile;
            try {


                this.init(req, res);


                valB64 = this._getCookie();
                Assure('AUTH COOKIE BASE-64 VALUE AVAILABLE', valB64 && valB64 !== NO_LOGIN);


                val = Identifier.unbase64(valB64);
                Assure('AUTH COOKIE VALUE AVAILABLE', val);


                [ckId, ckEmail, ckRole, expires, ckIdentifier] = val.split(":");
                Assure('AUTH COOKIE VALUE SPLIT TO VALID PARTS', ckId && ckEmail && ckRole && expires && ckIdentifier);
                Assure("COOKIE EXPIRATION TIME HAS NOT PAST ", +expires > Date.now())


                identifier = this._createHash(ckId, ckEmail, ckRole);
                Assure("COOKIE IDENTIFIER CAN BE VERIFIED", Object.is(identifier, ckIdentifier))


                token = this._createToken({id: ckId, email: ckEmail, role: ckRole});
                Assure('USER TOKEN HAS BEEN REFRESHED', !!token)


                this._setCookie(Identifier.base64(token))
                Assure('REFRESHED TOKEN HAS BEEN ATTACHED TO COOKIE', true)

                userProfile = {
                    id: ckId,
                    email: ckEmail,
                    role: ckRole
                };

                return userProfile

            } catch (err) {
                Logger(err, {valB64, val, ckId, ckEmail, expires, ckIdentifier, identifier, token})
                this._blockRequest();
                return false;
            }

        },


        /**
         *
         * @param req
         * @param res
         */
        deprecate: function (req, res) {

            this.init(req, res);

            this._blockRequest();

        },


        /**
         *
         * @returns {boolean}
         * @private
         */
        _blockRequest: function () {
            try {

                this._setCookie(NO_LOGIN)
                Assure('THE REQUEST WAS BLOCKED WITH A "NO-LOGIN" VALUE  ', true);

                return false;

            } catch (err) {
                Logger(err, {})
                return false;
            }
        },


        /**
         *
         * @param profile
         * @returns {string}
         * @private
         */
        _createToken: function (profile) {
            let expires, value, identifier
            try {

                expires = Date.now() + 1000 * 60 * 30
                identifier = this._createHash(profile.id, profile.email, profile.role)

                return [profile.id, profile.email, profile.role, expires, identifier].join(":")

            } catch (err) {
                Logger(err, {now: expires, value, identifier})
                throw new Error(err);
            }
        },


        /**
         *
         * @param userId
         * @param userEmail
         * @param userRole
         * @returns {string}
         * @private
         */
        _createHash: function (userId, userEmail, userRole) {

            let value = [userId, userEmail, userRole];

            return Identifier.sha256(value + process.env.ENV_APISEC + this.req.headers['user-agent']);

        },


        /**
         *
         * @returns {*}
         */
        _getCookie: function () {
            return this.req.cookies[TOKEN];
        },


        /**
         *
         * @param value
         * @param cname
         * @param opts
         * @private
         */
        _setCookie: function (value, cname = TOKEN, opts = null) {

            if (!opts) opts = TOKEN_OPTS;
            opts = {...opts, domain: process.env.ENV_APPDOM};

            this.res.cookie(cname, value, opts);
        },


    }

}
