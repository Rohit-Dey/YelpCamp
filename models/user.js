const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//adds on to our schema an username and password field
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema);