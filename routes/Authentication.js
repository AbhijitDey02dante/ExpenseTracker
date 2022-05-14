"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
const userController = require('../controller/user');
const expenseController = require('../controller/expense');
router.post('/signup', userController.addUser);
router.post('/login', userController.getUser);
router.get('/authenticate', authenticateToken, userController.checkUser);
router.post('/add_expense', authenticateToken, expenseController.postExpense);
router.get('/get_expense', authenticateToken, expenseController.getExpense);
router.post('/delete_expense', authenticateToken, expenseController.deleteExpense);
router.post('/buy_premium', authenticateToken, userController.buyPremium);
router.post("/payment/verify", userController.paymentVerify);
router.post("/add_order", authenticateToken, userController.addOrder);
router.get("/getOrder", authenticateToken, userController.getOrder);
router.post("/update_user_amount", authenticateToken, userController.updateAmount);
router.get("/getLeaderboard", authenticateToken, userController.getLeaderboard);
router.post("/password/forgotpassword", userController.sendMail);
router.get("/password/resetpassword/:uuid", userController.resetPassword);
router.post("/password/updatepassword", userController.updatePassword);
router.get('/download', authenticateToken, expenseController.download);
router.post('/download_record', authenticateToken, expenseController.updateRecord);
router.get('/get_record', authenticateToken, expenseController.getRecord);
exports.default = router;
