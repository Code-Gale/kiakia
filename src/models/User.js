const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    phoneNumber : {
        type : String,
        required : true
    },
    userRole : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    resetPasswordToken : {
        type: String
    },
    resetPasswordExpires : {
        type: String
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User