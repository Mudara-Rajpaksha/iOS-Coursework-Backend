const WalletController = require('../controllers/wallet.controller.js')
const WalletMiddleware = require('../middlewares/wallet.middleware.js')
const UserMiddleware = require('../middlewares/user.middleware.js')

exports.routesConfig = function(app) {
    app.post('/wallet/add', [
        UserMiddleware.checkValidJWT,
        WalletMiddleware.validateAdd,
        WalletController.addTransaction
    ]);

    app.post('/wallet/getTransactionList', [
        UserMiddleware.checkValidJWT,
        WalletMiddleware.validateGetList,
        WalletController.getTransactionList
    ]);

    app.post('/wallet/getTransaction', [
        UserMiddleware.checkValidJWT,
        WalletMiddleware.validateGetTransaction,
        WalletController.getTransaction
    ]);

    app.post('/wallet/getWalletDetails', [
        UserMiddleware.checkValidJWT,
        WalletMiddleware.validateGetList,
        WalletController.getWalletDetails
    ]);
};