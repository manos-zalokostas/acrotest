const {Assure, Logger} = require("../../helper/Ally");
const Util = require("../../helper/Util");
const Model = require("./Model");
const {MSG} = require("../../env");

const OFFSET_DEF = 1;
const BLOCK_DEF = 25;


/**
 *
 */
module.exports = (req, res) => {

    let data = {};


    return {


        /**
         *
         * @returns {Promise<{error}|{data: Model[]}>}
         */
        async list() {
            let {offset, block} = req.query;
            offset ||= OFFSET_DEF;
            block ||= BLOCK_DEF;
            try {

                validate([
                    ['offset', offset],
                    ['block', block]
                ])

                data = await Model.selectAll(offset, block)

                return {data}

            } catch (error) {
                Logger(error, {query: req.query})
                return {error}
            }

        },


        /**
         *
         * @returns {Promise<{data: (*|{})}>}
         */
        async read() {
            let {id} = req.params;
            try {

                validate([
                    ['id', id],
                ])

                data = data = await Model.select(id)

                return {data}

            } catch (error) {
                Logger(error, {id})
                return {error}
            }

        },


        /**
         *
         * @returns {Promise<{data: {password: string, data: Model<*, TModelAttributes>}}|{error}>}
         */
        async create() {
            let {email, password, role} = req.body;
            try {

                validate([
                    ['email', email],
                    ['password', password],
                    ['role', role],
                ])

                data = await Model.insert(email, password, role)

                return {data}

            } catch (error) {
                Logger(error, {email, password: '***'})
                return {error}
            }

        },


        /**
         *
         * @returns {Promise<{data: (*|{})}|{error}>}
         */
        async update() {
            let {id} = req.params;
            let {email, password, role} = req.body;
            try {

                validate([
                    ['id', id],
                    ['email', email],
                    ['password', password],
                    ['role', role],
                ])

                data = await Model.update(id, email, password, role)

                return {data}

            } catch (error) {
                Logger(error, {id, email, password: '***'})
                return {error}
            }

        },


        /**
         *
         * @returns {Promise<{error}|{data: {id}}>}
         */
        async delete() {
            let {id} = req.params;
            try {

                validate([
                    ['id', id],
                ])

                data = await Model.delete(id)

                return {data}

            } catch (error) {
                Logger(error, {id})
                return {error}
            }

        },

    }


}


/*

 */
const rule = {
    id: (x) => Assure(MSG.USID, x && Util.inRange(+x, 100)),
    email: (x) => Assure(MSG.EMAL, x && x.length <= 100 && Util.isEmail(x)),
    password: (x) => Assure(MSG.PSWD, x && Util.isPassword(x)),
    role: (x) => Assure(MSG.ROLE, x && Util.inArray(x, 'host', 'user')),
    offset: (x) => Assure(MSG.OFST, !Util.exists(x) || parseInt(x) <= 200),
    block: (x) => Assure(MSG.BLCK, !Util.exists(x) || parseInt(x) <= 200),
};


const validate = (a) => {
    a.forEach(
        ([key, val]) => rule[key](val)
    )
}

