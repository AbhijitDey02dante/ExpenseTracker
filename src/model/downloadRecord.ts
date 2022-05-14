import Sequelize from 'sequelize';

const sequelize=require('../util/database');

const Records=sequelize.define('records',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    url:{
        type:Sequelize.STRING,
        allowNull:false
    },
    date:{
        type:Sequelize.DATE,
        allowNull:false
    }
});

module.exports=Records;