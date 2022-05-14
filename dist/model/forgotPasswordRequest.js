"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize = require('../util/database');
const ForgotPasswordRequest = sequelize.define('forgot_password', {
    uuid: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        primaryKey: true
    },
    isactive: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false
    }
});
module.exports = ForgotPasswordRequest;
