const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay');
const Order = require('../model/order');

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
            password:encryptedPassword
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
    Order.findAll({where:{userId:req.user.id}})
    .then((output)=>res.json(output))
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
    })
    .catch(error=>console.log(error))
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
    console.log(req.body);
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
            "htmlContent":"<!DOCTYPE html><html><body><h1>Really sorry for the inconvenience</h1><p>We will get back to youy soon...</p></body></html>",
            "subject":"Reset Password"
         }
      ]
   
   }).then(function(data) {
     console.log(data);
   }, function(error) {
     console.error(error);
   });
}