const Sequelize = require('sequelize');

module.exports=new Sequelize(process.env.DATABASE_SCHEMA,process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD,{
    dialect:"mysql",
    host:process.env.DATABASE_HOST
})