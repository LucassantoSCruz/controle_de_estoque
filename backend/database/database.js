const sequelize = require('sequelize')

const connection = new sequelize(
        'db_teste',
        'root', 
        '', 
        {
            host:'localhost',
            dialect:'mysql',
            timezone:'-03:00'
        }
);

module.exports = connection;