const express=require('express');
const jwt=require('jsonwebtoken');

const router=express.Router();



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }


const userController=require('../controller/user');
const expenseController=require('../controller/expense');

router.post('/signup',userController.addUser);
router.post('/login',userController.getUser);
router.get('/authenticate',authenticateToken,userController.checkUser);
router.post('/add_expense',authenticateToken,expenseController.postExpense);
router.get('/get_expense',authenticateToken,expenseController.getExpense);

module.exports=router;