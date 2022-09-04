const Sequelize = require('sequelize');
const data = require("./data");


module.exports = {
    name: 'TASK',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 25],
                    msg: '"LABEL" SHOULD BE BETWEEN 1 - 25 CHARS LONG'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 300],
                    msg: '#"DESCRIPTION" SHOULD BE BETWEEN 1 - 300 CHARS LONG'
                }
            }
        },
        is_done: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: 0,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
    },
    load(db) {
        const Task = db.define(this.name, this.schema);
        return Task;
    },
    loadAssoc(db) {
        const defUser = require("../users/Definition")

        const Task = db.define(this.name, this.schema);
        const User = db.define(defUser.name, defUser.schema);

        User.hasMany(Task, {foreignKey: 'user_id'})
        Task.belongsTo(User, {foreignKey: 'user_id'})

        return Task;
    },
    data
}
