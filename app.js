const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');

dotenv.config();

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/order');

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasOne(Order);
Order.belongsTo(User);

const sequelize=require('./util/database');
const AuthenticationRouter = require('./routes/Authentication');

const app=express();

app.use(cors());
app.use(bodyParser.json());
app.use(AuthenticationRouter);



sequelize
.sync()
.then(()=>{
    app.listen(3000);
})
.catch((error)=>console.log(error));