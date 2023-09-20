const UserController = require('../controllers/user.controller.js')
const UserMiddleware = require('../middlewares/user.middleware.js')

exports.routesConfig = function(app) {
    app.post('/user/register', [
        UserMiddleware.validateRegister,
        UserMiddleware.checkExistingUser,
        UserController.saveNewUser
    ]);

    app.post('/user/login', [
        UserMiddleware.validateLogin,
        UserController.checkLogin
    ]);

    app.post('/user/update', [
        UserMiddleware.checkValidJWT,
        UserMiddleware.validateUpdate,
        UserController.updateUser
    ]);
};