const Sequelize = require('sequelize');

module.exports=new Sequelize('expense_tracker','root','Optimusprime',{
    dialect:"mysql",
    host:'localhost'
})