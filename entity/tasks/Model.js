const db = require("../../lib/sequelize")();
const definition = require("./Definition");
const {Logger} = require("../../helper/Ally");
const Task = definition.load(db)


/**
 *
 * @param query
 * @returns {Promise<{transformers: *, lines: *}>}
 */
module.exports = {


    /**
     *
     * @param user_id
     * @param offset
     * @param block
     * @returns {Promise<Model[]>}
     */
    async selectAll(user_id, offset = 1, block = 25) {
        try {

            let data = await Task.findAll({
                where: {user_id},
                order: [['id', 'ASC']],
                offset: ((+offset - 1) * +block),
                limit: (+block),
                raw: true,
            })

            data = data.map(o => ({...o, is_done: Boolean(o.is_done)}))
            return data;

        } catch (err) {
            Logger(err, {offset, block})
            throw err
        }
    },


    /**
     *
     * @param user_id
     * @param id
     * @returns {Promise<*>}
     */
    async select(user_id, id = 1) {
        try {

            let data = await Task.findOne({
                where: {id, user_id},
                raw: true,
            })

            if (!data) throw 'TASK NOT AVAILABLE';

            return {...data, is_done: Boolean(data.is_done)};

        } catch (err) {
            Logger(err, {id})
            throw err
        }
    },


    /**
     *
     * @param user_id
     * @param label
     * @param description
     * @param is_done
     * @returns {Promise<*>}
     */
    async insert(user_id, label, description, is_done) {
        is_done = is_done === 'true' ? 1 : 0
        try {
debugger
            let data = await Task.create({label, description, is_done, user_id})

            if (!data) throw 'TASK NOT CREATED';

            return data.dataValues

        } catch (err) {
            Logger(err, {label, description, is_done})
            throw err
        }
    },


    /**
     *
     * @param user_id
     * @param id
     * @param label
     * @param description
     * @param is_done
     * @returns {Promise<*>}
     */
    async update(user_id, id, label, description, is_done) {
        is_done = is_done === 'true' ? 1 : 0
        try {
debugger
            let data = await Task.update(
                {label, description, is_done}, {
                    where: {id, user_id}
                }
            )

            if (!data) throw 'TASK NOT UPDATED';

            return data;

        } catch (err) {
            Logger(err, {label, description, is_done})
            throw err
        }
    },


    /**
     *
     * @param user_id
     * @param id
     * @returns {Promise<number>}
     */
    async delete(user_id, id) {
        try {

            let data = await Task.destroy({
                    where: {id, user_id}
                }
            )

            if (!data) throw 'TASK NOT DELETED';

            return data;

        } catch (err) {
            throw err
        }
    },


}

