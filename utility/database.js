const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-app', 'root', 'Şifre',{
    dialect: 'mysql',
    host:'localhost'
});
module.exports= sequelize;  
