/**
 *
 * @param req
 * @param res
 * @returns {Promise<{error}|*>}
 */

module.exports = async () => {

    try {

        const db = require('./lib/sequelize')();


        const defs = [
            require('./entity/users/Definition'),
            require('./entity/tasks/Definition'),
        ];


        let tables = defineTables(defs, db);


        await synchronizeDb(defs, tables, db);


        await importData(defs, tables, db)


        console.log('DATABASE SYNCRONIZED');


    } catch (error) {

        console.log('ACERR: => COULD NOT SYNC DB', error);

    }
}


/**
 *
 * @param {*} defs
 * @param {*} db
 * @returns
 */
const defineTables = (defs, db) => {

    let tables = [];
    defs.forEach(
        (def) => tables.push(def.load(db))
    )
    return tables;

}


/**
 *
 * @param defs
 * @param tables
 * @param db
 * @returns {Promise<void>}
 */
const synchronizeDb = async (defs, tables, db) => {

    const config = {
        logging: console.log,
        force: true,
        // alter: true,
    };

    await db.sync(config)

}


/**
 *
 * @param defs
 * @param tables
 * @param db
 * @returns {Promise<void>}
 */
const importData = async (defs, tables, db) => {

    const Utils = require('./helper/Util');

    let i = 0;
    for (const def of defs) {
        try {

            let bulk = Utils.objectifyEntries(Object.keys(def.schema), def.data)

            await tables[i].bulkCreate(bulk)
            i++;

        } catch (error) {

            console.log(
                ' ---------------- ERROR IMPORT -------------',
                error,
                '----------------------------------------------------')
        }
    }
}





