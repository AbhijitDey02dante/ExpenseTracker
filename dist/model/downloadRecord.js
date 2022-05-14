"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize = require('../util/database');
const Records = sequelize.define('records', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    url: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    date: {
        type: sequelize_1.default.DATE,
        allowNull: false
    }
});
module.exports = Records;
