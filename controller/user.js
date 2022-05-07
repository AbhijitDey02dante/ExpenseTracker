const bcrypt=require('bcrypt');

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