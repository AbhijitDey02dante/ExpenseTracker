const Expense=require('../model/expense');

exports.postExpense = (req,res,next)=>{
    const obj={
        userId:req.user.id,
        amount:req.body.amount,
        category:req.body.category,
        description:req.body.description
    }
    Expense.create(obj)
    .then((result)=>res.json(result))
    .catch(error=>res.json({success:false}))
}

exports.getExpense=(req,res,next)=>{
    Expense.findAll({where:{userId:req.user.id}})
    .then(result=>res.json(result))
    .catch(error=>console.log(error))
}