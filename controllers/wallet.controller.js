const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');

exports.addTransaction = (req, res) => {
    const newTransactionData = {
        transactionId: uuidv4(),
        transactionType: req.body.transactionList[0].transactionType,
        transactionCategory: req.body.transactionList[0].transactionCategory,
        transactionDate: new Date().getTime(),
        transactionAmount: req.body.transactionList[0].transactionAmount,
        transactionRemark: req.body.transactionList[0].transactionRemark,
        transactionImg: req.body.transactionList[0].transactionImg || null
    };

    db.wallet.findOneAndUpdate({userId: req.body.userId}, {
        $push: {transactionList: {$each: [newTransactionData], $position: 0}}
    }, {new: true, upsert: true}).then(r => {
        if (r != null) {
            console.log(`wallet updated ${newTransactionData}`);
            res.status(200).send({status: true, data: newTransactionData})
        } else {
            res.status(400).send({status: false, message: 'Update Error'});
        }
    })
}

exports.getTransactionList = async (req, res) => {
    let isFiltered = false;
    let filterType = null;
    let transType = null;

    if ('filterType' in req.body) {
        filterType = req.body.filterType;
    }

    if ('transType' in req.body) {
        transType = req.body.transType;
    }

    const user = await db.wallet.findOne({userId: req.body.userId});

    if (!user) {
        return res.status(404).send({status: false, message: 'User not found'});
    }

    if (filterType === "1" || filterType === "2" || filterType === "3") {
        isFiltered = true;
    }

    const filteredTransactions = filterTransactions(user.transactionList, filterType, new Date());

    const filteredTransactionsType = filterTypes(filteredTransactions, transType);

    res.status(200).send({
        status: true, data: {
            isFiltered: isFiltered,
            transactionList: filteredTransactionsType
        }
    })
}

exports.getTransaction = async (req, res) => {
    const user = await db.wallet.findOne({userId: req.body.userId});

    if (!user) {
        return res.status(404).send({status: false, message: 'User not found'});
    }

    const transaction = user.transactionList.find(
        (t) => t.transactionId === req.body.transactionId
    );

    if (!transaction) {
        return res.status(400).send({status: false, message: 'Transaction not found'});
    }

    res.status(200).send({status: true, data: transaction})
}

exports.getWalletDetails = async (req, res) => {
    let isFiltered = false;
    let filterType = null;
    let income = 0;
    let expenses = 0;

    if ('filterType' in req.body) {
        filterType = req.body.filterType;
    }

    const user = await db.wallet.findOne({userId: req.body.userId});

    if (!user) {
        return res.status(404).send({status: false, message: 'User not found'});
    }

    if (filterType === "1" || filterType === "2" || filterType === "3") {
        isFiltered = true;
    }

    const filteredTransactions = filterTransactions(user.transactionList, filterType, new Date());

    filteredTransactions.forEach((transaction) => {
        if (transaction.transactionType === 1) {
            income += transaction.transactionAmount;
        } else if (transaction.transactionType === 2) {
            expenses += transaction.transactionAmount;
        }
    });

    res.status(200).send({
        status: true, data: {
            userId: user.userId,
            isFiltered: isFiltered,
            incomeAmount: income,
            expenseAmount: expenses,
        }
    })
}

function filterTransactions(transactions, filter, currentDate) {
    return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        if (filter === "0") {
            return (
                transactionDate.getDate() === currentDate.getDate()
            );
        } else if (filter === "1") {
            return (
                transactionDate.getMonth() === currentDate.getMonth()
            );
        } else if (filter === "2") {
            return transactionDate.getFullYear() === currentDate.getFullYear();
        } else {
            return true;
        }
    });
}

function filterTypes(transactions, type) {
    return transactions.filter((transaction) => {
        if (type === "0") {
            return true;
        } else if (type === "1") {
            return transaction.transactionType === 1;
        } else if (type === "2") {
            return transaction.transactionType === 2;
        } else {
            return true;
        }
    });
}