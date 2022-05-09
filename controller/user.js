const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

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