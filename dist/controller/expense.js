"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Expense = require('../model/expense');
const User = require('../model/user');
const Records = require('../model/downloadRecord');
exports.postExpense = (req, res, next) => {
    const obj = {
        userId: req.user.id,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description
    };
    Expense.create(obj)
        .then((result) => res.json(result))
        .catch((error) => res.json({ success: false }));
};
exports.getExpense = (req, res, next) => {
    let ITEMS_PER_PAGE = +req.query.pageItem || 10;
    const page = +req.query.page || 1;
    let totalItems;
    Expense.count({ where: { userId: req.user.id } })
        .then((numProducts) => {
        totalItems = numProducts;
        return Expense.findAll({ where: { userId: req.user.id }, limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE });
    })
        .then((result) => {
        const detailedExpense = [{ total: totalItems }, [...result]];
        res.status(200).json(detailedExpense);
    })
        .catch((error) => console.log(error));
};
exports.deleteExpense = (req, res, next) => {
    let amount;
    Expense.findAll({ where: { id: req.body.id } })
        .then((element) => {
        amount = element[0].amount;
        return element[0].destroy();
    })
        .then(() => {
        return User.findAll({ where: { id: req.user.id } });
    })
        .then((result) => {
        console.log(result[0].spent);
        result[0].spent = result[0].spent - +amount;
        return result[0].save();
    })
        .then(() => {
        res.status(200).json({ success: true });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false });
    });
};
// Download via S3
exports.download = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let mainData = 'Created,Category,Description,Amount';
    try {
        const expense = yield Expense.findAll({ where: { userId: req.user.id } });
        expense.forEach((element) => {
            // console.log(element.description);
            let desc = (element.description).replaceAll(',', '.');
            mainData = mainData + `\n${element.createdAt},${element.category},${desc},Rs. ${element.amount}`;
        });
        const stringifiedExpense = mainData;
        let today = new Date().toString();
        const filename = `Expense_${req.user.id}_${today.replaceAll(' ', '_')}.csv`;
        //****************************** */
        const bucketName = process.env.BUCKET_NAME;
        const keyId = process.env.BUCKET_KEY_ID;
        const secretKey = process.env.BUCKET_SECRET_KEY;
        let s3bucket = new aws_sdk_1.default.S3({
            accessKeyId: keyId,
            secretAccessKey: secretKey
        });
        let params = {
            Bucket: bucketName,
            Key: filename,
            Body: stringifiedExpense,
            ACL: 'public-read'
        };
        s3bucket.upload(params, (error, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                res.status(500).json({ error, success: true });
            }
            else {
                res.status(200).json({ response, success: true });
            }
        }));
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateRecord = (req, res, next) => {
    Records.create({
        name: req.body.Key,
        url: req.body.Location,
        date: new Date(),
        userId: req.user.id
    })
        .then(() => {
        res.status(200).json({ success: true });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false });
    });
};
exports.getRecord = (req, res, next) => {
    Records.findAll({ where: { userId: req.user.id } })
        .then((result) => res.status(200).json(result))
        .catch((error) => {
        console.log(error);
        res.status(500).json({ success: "fail" });
    });
};
