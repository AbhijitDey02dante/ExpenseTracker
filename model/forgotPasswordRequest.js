const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const ForgotPasswordRequest=sequelize.define('forgot_password',{
    uuid:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    isactive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
});

module.exports=ForgotPasswordRequest;