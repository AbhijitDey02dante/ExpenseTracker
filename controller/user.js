const path=require('path');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay');
const Order = require('../model/order');
const ForgotPasswordRequest = require('../model/forgotPasswordRequest');
const {v4 : uuidv4} = require('uuid');

const { Op } = require("sequelize");

const User=require('../model/user');

exports.addUser=async (req,res,next)=>{
    try{
        const salt=await bcrypt.genSalt(10);
        const encryptedPassword=await bcrypt.hash(req.body.password,salt);

        User.create({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:encryptedPassword,
            premium:0
        })
        .then((result)=>{
            console.log('added');
            res.json({success:true});
        })
        .catch((error)=>{
            console.log(error);
            res.json({success:false})
        })
    }
    catch(e){
        console.log(e);
        res.json({success:false});
    }
}

function generateAccessToken(id){
    return jwt.sign(id,process.env.TOKEN_SECRET);
}


exports.getUser = (req,res,next) => {
    const email=req.body.email;
    User.findAll({where:{email:email}})
    .then(result=>{
        bcrypt.compare(req.body.password,result[0].password, function(error,resolved){
            if(error){
                console.log("error");
            }
            if(resolved){
                const obj={
                    id:`${result[0].id}`
                }
                const token=generateAccessToken(JSON.stringify(obj));
                res.json(token);
            }
            else{
                res.status(401).json({success:false,message:"Password doesn't match"});
            }
        })
    })
    .catch(error=>{
        res.status(404).json({success:false,message:"User not found"});
    })
}

exports.checkUser=(req,res,next)=>{
    User.findAll({where:{id:req.user.id}})
    .then(result=>res.json(result))
    .catch(error=>console.log(error));
}


// Razorpay add
var instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
});

exports.buyPremium=(req,res,next)=>{
    console.log(req.body);
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
    };
    instance.orders.create(options, function(err,order){
        res.json({orderId:order.id});
    })
}

exports.paymentVerify=(req,res)=>{
    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
     let crypto = require("crypto");
     let expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_KEY_SECRET)
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     let response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
        res.send(response);
     }

exports.addOrder=(req,res,next)=>{
    Order.create({orderId:req.body.orderid, userId:req.user.id})
    .then(()=>res.json({success:true}))
    .catch(error=>console.log(error));
}

exports.getOrder=(req,res,next)=>{
    let finalValue;
    Order.findAll({where:{userId:req.user.id}})
    .then((output)=>{
        finalValue=output;
        if(output.length>0){
            User.findAll({where:{id:req.user.id}})
            .then(user=>{
                console.log('Changed premium');
                user[0].premium=1;
                return user[0].save()
            })
            .then()
            .catch(error=>console.log(error))
        }
    })
    .then(()=>{
        console.log('Finding order');
        res.json(finalValue);
    })
    .catch(error=>console.log(error));
}

exports.updateAmount=(req,res,next)=>{
    User.findAll({where:{id:req.user.id}})
    .then(result=>{
        if(result[0].spent)
        {
            result[0].spent+= +req.body.amount;
        }
        else{
            result[0].spent=req.body.amount;
        }
        result[0].save();
        res.status(200).json({sucess:true});
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({sucess:false});
    })
}

exports.getLeaderboard = (req,res,next)=>{
    User.findAll({
        where:{
            spent:{[Op.ne]:null}
        },
        order:[
            ['spent','DESC']
        ]
    })
    .then(result=>res.json(result))
    .catch(error=>console.log(error))
}



var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.MAIL_API_KEY;

exports.sendMail=(req,res,next)=>{
    User.findAll({where:{email:req.body.email}})
    .then((users)=>{
        let userId;
        try{
            userId=users[0].id;
        }
        catch(error){
            res.status(404).json({message:'error'});
        }
        if(users.length>0){
        const newId = uuidv4();
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender":{ "email":"abhijitdey51234@gmail.com", "name":"Expense Tracker"},
            "subject":"Password Reset",
            "htmlContent":"<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
            "params":{
            "greeting":"This is the default greeting",
            "headline":"This is the default headline"
            },
        "messageVersions":[
            //Definition for Message Version 1 
            {
                "to":[
                {
                    "email":req.body.email,
                    "name":"Abhijit Dey"
                }
                ],
                "htmlContent":`<!DOCTYPE html><html><body><h1>Click on the below link to reset your Expense Tracker password</h1><p>http://localhost:3000/password/resetpassword/${newId}</p></body></html>`,
                "subject":"Reset Password"
            }
        ]

        }).then(function(data) {
        console.log(data);
        ForgotPasswordRequest.create({
            uuid:newId,
            isactive:true,
            userId:userId
        })
        .then(()=>res.json({success:true}))
        .catch(error=>console.log(error));


            }, function(error) {
            console.error(error);
            });
        }
    })
    .catch(error=>console.log(error));
}


exports.resetPassword=(req,res,next)=>{
    const uuid=req.params.uuid;
    console.log(req.params.uuid);
    ForgotPasswordRequest.findAll({where:{uuid:uuid,isactive:1}})
    .then((user)=>{
        if(user.length>0)
            res.sendFile('resetPassword.html', { root: path.join(__dirname, '../public') });
        else
            res.send('<h1>password link expired</h1>')
    })
    .catch(error=>console.log(error))
}

exports.updatePassword=async (req,res,next)=>{
    const uuid=req.body.uuid;
    const password=req.body.password;
    try{
        const salt=await bcrypt.genSalt(10);
        const encryptedPassword=await bcrypt.hash(password,salt);
        console.log(uuid,password);
        ForgotPasswordRequest.findAll({where:{uuid:uuid}})
        .then(element=>{
            User.findAll({where:{id:element[0].userId}})
            .then(user=>{
                user[0].password=encryptedPassword;
                return user[0].save()
            })
            .then(()=>{
                element[0].isactive=0;
                return element[0].save()
            })
            .then(()=>{
                console.log('updated');
                res.send('<h2>Password updated, please go to main page to login!</h2>');
            })
            .catch(error=>console.log(error));
        })
        .catch(error=>console.log(error));
    }
    catch(error){
        console.log(error);
    }
}