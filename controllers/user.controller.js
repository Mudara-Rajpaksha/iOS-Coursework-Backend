const db = require("../config/mongo.init");
const {v4: uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");

exports.checkLogin = (req, res) => {
    const jwtToken = jwt.sign(req.body, process.env.JWT_SECRET)
    db.user.find({email: req.body.email, password: req.body.password}).exec().then(r => {
        if (r.length !== 0) {
            res.status(200).send({
                status: true, data:
                    {
                        "user": r[0],
                        "accessToken": jwtToken
                    }
            })
        } else {
            console.log(`no user found`);
            res.status(401).send({status: false, message: 'Please Check Your Credentials'})
        }
    })
}

exports.saveNewUser = (req, res) => {
    const user = new db.user({
        userId: uuidv4(),
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    user.save().then(r => {
        if (r.length !== 0) {
            console.log(`new user registered ${r}`);
            res.status(200).send({status: true, data: user})
        } else {
            console.log(`registration error`);
            res.status(400).send({status: false, message: 'Registration Error'});
        }
    });
}

exports.updateUser = (req, res) => {
    db.user.findOneAndUpdate({userId: req.body.userId}, {
        $set: {
            username: req.body.username,
            imgUrl: req.body.imgUrl
        }
    }, {new: true}).then(r => {
        if (r != null) {
            console.log(`user updated ${r}`);
            res.status(200).send({status: true, data: r})
        } else {
            res.status(400).send({status: false, message: 'Update Error'});
        }
    })
}