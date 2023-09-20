const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const db = require("../config/mongo.init");
const makeRequired = (x) => x.required();

exports.validateLogin = (req, res, next) => {
    const {error} = userModel.joiUser.fork(['email', 'password'], makeRequired).validate({
        email: req.body.email,
        password: req.body.password
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateRegister = (req, res, next) => {
    const {error} = userModel.joiUser.fork(['email', 'username', 'password'], makeRequired).validate({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.validateUpdate = (req, res, next) => {
    const {error} = userModel.joiUser.fork(['userId', 'username'], makeRequired).validate({
        userId: req.body.userId,
        username: req.body.username
    });
    if (error) return res.status(400).send({status: false, message: error.details[0].message});
    return next();
}

exports.checkValidJWT = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({status: false, data: "Unauthorized"});
            } else {
                req.jwt = jwt.verify(authorization[1], process.env.JWT_SECRET);
                return next();
            }

        } catch (err) {
            return res.status(401).send({status: false, message: "Unauthorized"});
        }
    } else {
        return res.status(401).send({status: false, message: "Unauthorized"});
    }
};

exports.checkExistingUser = (req, res, next) => {
    db.user.find({email: req.body.email}).exec().then(r => {
        if (r.length !== 0) {
            console.log(`existing user found`);
            return res.status(400).send({status: false, message: "An account is already registered with your email"})
        } else {
            console.log(`existing user not found`);
            return next()
        }
    })
}