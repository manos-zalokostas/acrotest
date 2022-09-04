const db = require("../../lib/sequelize")();
const definition = require("./Definition");
const Identifier = require("../../helper/Identifier");
const {Logger} = require("../../helper/Ally");
const User = definition.load(db)


/**
 *
 * @param query
 * @returns {Promise<{transformers: *, lines: *}>}
 */
module.exports = {


    /**
     *
     * @returns {Promise<Model[]>}
     */
    async selectAll(offset = 1, block = 25) {
        try {

            let data = await User.findAll({
                order: [['id', 'ASC']],
                offset: ((+offset - 1) * +block),
                limit: (+block),
                raw: true,
            })

            data = data.map(o => ({...o, password: "***"}))

            return data;

        } catch (err) {
            Logger(err, {offset, block})
            throw err
        }
    },


    /**
     *
     * @returns {Promise<*>}
     * @param email
     * @param password
     */
    async selectByCreds(email, password) {
        try {

            let data = await User.findOne({
                where: {email},
                raw: true,
            })

            if (!data) throw 'USER NOT REGISTERED'

            if (!(Object.is(data.password, Identifier.sha256(password)))) throw 'CREDENTIALS NOT VERIFIED';

            data = {...data, password: "***"}
            return data;

        } catch (err) {
            Logger(err, {email, password: '***'})
            throw err;
        }
    },


    /**
     *
     * @param id
     * @returns {Promise<*>}
     */
    async select(id = 1) {
        try {

            let data = await User.findOne({
                where: {id},
                raw: true,
            })

            if(!data) throw 'USER NOT AVAILABLE';

            data = {...data, password: "***"}

            return data;

        } catch (err) {
            Logger(err, {id})
            throw err;
        }
    },


    /**
     *
     * @param email
     * @param password
     * @param role
     * @returns {Promise<{password: string, data: Model<any, TModelAttributes>}>}
     */
    async insert(email, password, role = 'user') {
        try {
            let data = await User.create({email, password: Identifier.sha256(password), role})

            if(!data) throw 'USER NOT CREATED';

            return {...data.dataValues, password: '***'};

        } catch (err) {
            Logger(err, {email, password: '***', role})
            throw err;
        }
    },


    /**
     *
     * @returns {Promise<*>}
     * @param id
     * @param email
     * @param password
     */
    async update(id, email, password, role) {
        try {

            let data = await User.update(
                {email, password: Identifier.sha256(password), role}, {
                    where: {id}
                }
            )

            if(!data) throw 'USER NOT UPDATED';

            return data;

        } catch (err) {
            Logger(err, {id, email, password: '***'})
            throw err;
        }
    },


    /**
     *
     * @param id
     * @returns {Promise<number>}
     */
    async delete(id) {
        try {

            let data = await User.destroy({
                    where: {id}
                }
            )

            if(!data) throw 'USER NOT DELETED';

            return data;

        } catch (err) {
            Logger(err, {id})
            throw err;
        }
    },


}

