const walletModel = require("../models/wallet.model");
const makeRequired = (x) => x.required();

exports.validateAdd = (req, res, next) => {
    const {error} = walletModel.joiWallet.fork(['userId', 'transactionList'], makeRequired).validate({
        userId: req.body.userId,
        transactionList: req.body.transactionList
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateGetList = (req, res, next) => {
    const {error} = walletModel.joiWallet.fork(['userId'], makeRequired).validate({
        userId: req.body.userId
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateGetTransaction = (req, res, next) => {
    const {error} = walletModel.joiTransactionValidateSchema.validate({
        userId: req.body.userId,
        transactionId: req.body.transactionId
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}