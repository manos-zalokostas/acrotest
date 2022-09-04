const {Logger, Assure} = require("../../helper/Ally");
const UserModel = require('../users/Model');
const Util = require("../../helper/Util");
const {MSG} = require("../../env");

/**
 *
 */
module.exports = (req, res) => {

    let data = {};


    return {


        /**
         *
         * @returns {Promise<{data: {password: string, data: Model<*, TModelAttributes>}}|{error}>}
         */
        async submit() {
            let {email, password} = req.body;

            try {

                validate.email(email);
                validate.password(password);

                data = await UserModel.insert(email, password)

                return {data}

            } catch (error) {
                Logger(error, {email, password: '***'})
                return {error}
            }
        },


    }


}


const validate = {
    email: (x) => Assure(MSG.EMAL, x && Util.isEmail(x)),
    password: (x) => Assure(MSG.PSWD, x && Util.isPassword(x)),
};
