const {Logger} = require("../../helper/Ally");
const {Assure} = require("../../helper/Ally");
const UserModel = require('../users/Model');
const Util = require("../../helper/Util");
const {MSG} = require("../../env");

/**
 *
 */
module.exports = (req, res) => {

    let data = {},
        valid = {};


    return {


        /**
         *
         * @returns {Promise<{data: (*|{})}|{error}>}
         */
        async submit() {
            let {email, password} = req.body;

            try {

                validate([
                    ['email', email],
                    ['password', password]
                ])

                const Auth = require("../../service/auth")()
                data = await UserModel.selectByCreds(email, password);

                Auth.register(data, req, res)

                return {data}

            } catch (error) {
                Logger(error, {email, password: '***'})
                return {error}
            }
        },


    }


}


/*

 */
const rule = {
    email: (x) => Assure(MSG.EMAL, x && Util.isEmail(x)),
    password: (x) => Assure(MSG.PSWD, x && Util.isPassword(x)),
};


const validate = (a) => {
    a.forEach(
        ([key, val]) => rule[key](val)
    )
}


