const Joi = require('joi');

exports.WalletSchema = function (mongoose) {
    const transactionSchema = new mongoose.Schema({
        transactionId: String,
        transactionType: Number,
        transactionCategory: Number,
        transactionDate: Number,
        transactionAmount: Number,
        transactionRemark: String,
        transactionImg: String
    });

    const walletSchema = new mongoose.Schema({
        userId: String,
        transactionList: [transactionSchema]
    });

    return mongoose.model(process.env.MONGOOSE_WALLET_COLLECTION, walletSchema);
};

exports.joiTransactionValidateSchema = Joi.object({
    userId: Joi.string().required(),
    transactionId: Joi.string().required()
});

const joiTransactionSchema = Joi.object({
    transactionId: Joi.string(),
    transactionType: Joi.number().required(),
    transactionCategory: Joi.number().required(),
    transactionDate: Joi.number(),
    transactionAmount: Joi.number().required(),
    transactionRemark: Joi.string().required(),
    transactionImg: Joi.string()
});

exports.joiWallet = Joi.object({
    userId: Joi.string(),
    transactionList: Joi.array().items(joiTransactionSchema)
})