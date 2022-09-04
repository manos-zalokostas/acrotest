const Sequelize = require('sequelize');
const data = require('./data')


module.exports = {
    name: 'USER',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: '"EMAIL" SHOULD BE PROPERLY FORMATTED'
                }
            }
        },
        password: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: 64,
                    msg: '"PASSWORD" SHOULD BE EXACTLY 64 CHARS LONG'
                }
            }
        },
        role: {
            type: Sequelize.ENUM('host', 'user'),
            allowNull: false,
            default: 'user'
        }
    },
    load(db) {
        const User = db.define(this.name, this.schema);
        return User;
    },
    loadAssoc(db) {
        const defTask = require("../tasks/Definition")

        const User = db.define(this.name, this.schema);
        const Task = db.define(defTask.name, defTask.schema);

        User.hasMany(Task, {foreignKey: 'user_id'})
        Task.belongsTo(User, {foreignKey: 'user_id'})

        return User;
    },
    data
}
