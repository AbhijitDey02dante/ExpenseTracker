const path=require('path');
const fs=require('fs');
const https=require('https');

const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
// const compression=require('compression');

dotenv.config();

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/order');
const ForgotPasswordRequest=require('./model/forgotPasswordRequest');
const Records=require('./model/downloadRecord');


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasOne(Order);
Order.belongsTo(User);


User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(Records);
Records.belongsTo(User);


const sequelize=require('./util/database');
const AuthenticationRouter = require('./routes/Authentication');

const app=express();
app.use(express.static(path.join(__dirname, 'public')));

// const privateKey=fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

// const accessLogStream=fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'});

app.use(cors());
app.use(helmet());
// app.use(morgan('combined',{stream:accessLogStream}));
// app.use(compression());
app.use(bodyParser.json());
app.use(AuthenticationRouter);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});



sequelize
.sync()
.then(()=>{
    app.listen(3000);
    // https.createServer({key:privateKey,cert:certificate},app).listen(3000);
})
.catch((error)=>console.log(error));