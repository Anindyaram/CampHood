const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMessage = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
UserSchema.plugin(passportLocalMessage);
module.exports = mongoose.model('User' , UserSchema);