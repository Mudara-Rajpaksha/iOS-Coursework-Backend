const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const walletModel = require('../models/wallet.model');
const dotenv = require('dotenv')
dotenv.config()
const db = {};

const connectDatabase = async() => {
    return await mongoose.connect(process.env.MONGOOSE_CONNECTION);
}

connectDatabase().then(connection => {
    db.user = userModel.UserSchema(connection)
    db.wallet = walletModel.WalletSchema(connection)
})

module.exports = db;