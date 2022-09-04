const {Sequelize} = require('sequelize');

let instance = null;

module.exports = () => {

    if (!instance) {
        instance = new Sequelize(
            process.env.ENV_DBNAME,
            process.env.ENV_DBUSER,
            process.env.ENV_DBPASS,
            {
                host: process.env.ENV_DBHOST,
                dialectOptions: {
                    decimalNumbers: true,
                },
                dialect: 'mysql',
                define: {
                    charset: 'utf8',
                    collate: 'utf8_general_ci',
                    freezeTableName: true,
                    timestamps: false,
                    omitNull: true
                },
                pool: {
                    acquire: 30000,
                    idle: 10000,
                    max: 10,
                    min: 0,
                },
                logging: false
            },
        );
    }

    return instance;
    // return {
    //     instance,
    //     // load: (def) => {
    //     //     const model = instance.define(def.name, def.schema(instance))
    //     //     // if(def.DEPEND) RunAssociations(model, def.DEPEND)
    //     //     return model;
    //     // }
    // };

}
