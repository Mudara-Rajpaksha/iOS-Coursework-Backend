const Joi = require('joi');

exports.UserSchema = function (mongoose) {
    const mongooseUser = new mongoose.Schema({
        userId: String,
        username: String,
        email: String,
        password: String,
        imgUrl: String
    });

    return mongoose.model(process.env.MONGOOSE_USERS_COLLECTION, mongooseUser);
}

exports.joiUser = Joi.object({
    userId: Joi.string(),
    username: Joi.string(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email({ tlds: { allow: false } }),
    imgUrl: Joi.string()
})