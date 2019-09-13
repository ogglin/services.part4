module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('users', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.TEXT
        },
        phone: {
            type: Sequelize.TEXT
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        position: {
            type: Sequelize.STRING
        },
        last_login: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        role_id: {
            type: Sequelize.INTEGER
        },
        token: {
            type: Sequelize.STRING
        },
        ip: {
            type: Sequelize.STRING
        }
    });
    return User;
};
