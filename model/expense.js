const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Expense=sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
});

module.exports=Expense;