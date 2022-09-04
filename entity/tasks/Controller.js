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


            let {offset, block} = req.query,
                user_id = req.userProfile.id;

            offset ||= OFFSET_DEF;
            block ||= BLOCK_DEF;

            try {

                validate([
                    ['offset', offset],
                    ['block', block]
                ])

                data = await Model.selectAll(user_id, offset, block)

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
            let {id} = req.params,
                user_id = req.userProfile.id;

            try {

                validate([
                    ['id', id],
                ])

                data = await Model.select(user_id, id)

                return {data}

            } catch (error) {
                Logger(error, {user_id, params: req.params})
                return {error}
            }

        },


        /**
         *
         * @returns {Promise<{data: (*|{})}|{error}>}
         */
        async create() {
            let {label, description, is_done} = req.body,
                user_id = req.userProfile.id;

            try {

                validate([
                    ['label', label],
                    ['desc', description],
                    ['done', is_done]
                ])

                data = await Model.insert(user_id, label, description, is_done)

                return {data}

            } catch (error) {
                Logger(error, {user_id, body: req.body})
                return {error}
            }

        },


        /**(
         *
         * @returns {Promise<{data: (*|{})}|{error}>}
         */
        async update() {
            let {id} = req.params,
                user_id = req.userProfile.id,
                {label, description, is_done} = req.body;

            try {

                validate([
                    ['id', id],
                    ['label', label],
                    ['desc', description],
                    ['done', is_done]
                ])

                data = await Model.update(user_id, id, label, description, is_done)

                return {data}

            } catch (error) {
                Logger(error, {user_id, params: req.params, body: req.body})
                return {error}
            }

        },


        /**(
         *
         * @returns {Promise<{data: number}|{error}>}
         */
        async delete() {
            let {id} = req.params,
                user_id = req.userProfile.id;

            try {

                validate([
                    ['id', id],
                ])

                data = await Model.delete(user_id, id)

                return {data}

            } catch (error) {
                Logger(error, {user_id, id})
                return {error}
            }

        },

    }


}


/*

 */
const rule = {
    id: (x) => Assure(MSG.TSID, x && Util.inRange(+x, 2000)),
    label: (x) => Assure(MSG.LABL, x && Util.inRange(x.length, 25)),
    desc: (x) => Assure(MSG.DESC, x && Util.inRange(x.length, 300)),
    done: (x) => Assure(MSG.ISDO, x && Util.inArray(x, 'true', 'false')),
    offset: (x) => Assure(MSG.OFST, !Util.exists(x) || parseInt(x) < 201),
    block: (x) => Assure(MSG.BLCK, !Util.exists(x) || parseInt(x) < 201),
};


const validate = (a) => {
    a.forEach(
        ([key, val]) => rule[key](val)
    )
}

