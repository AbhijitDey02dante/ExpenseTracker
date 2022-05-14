import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router=Router();



function authenticateToken(req:any, res:any, next:any) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET!, (err:any, user:any) => {
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
router.post('/delete_expense',authenticateToken,expenseController.deleteExpense);


router.post('/buy_premium',authenticateToken,userController.buyPremium);
router.post("/payment/verify",userController.paymentVerify);
router.post("/add_order",authenticateToken,userController.addOrder);
router.get("/getOrder",authenticateToken,userController.getOrder);
router.post("/update_user_amount",authenticateToken,userController.updateAmount);
router.get("/getLeaderboard",authenticateToken,userController.getLeaderboard);


router.post("/password/forgotpassword",userController.sendMail);
router.get("/password/resetpassword/:uuid",userController.resetPassword);
router.post("/password/updatepassword",userController.updatePassword);

router.get('/download',authenticateToken,expenseController.download);
router.post('/download_record',authenticateToken,expenseController.updateRecord);
router.get('/get_record',authenticateToken,expenseController.getRecord);


export default router;