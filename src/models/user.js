const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        trim:true,
        minLength:4,
        required:true,
        maxLength:20,        
    },
    lastName:{
        type:String,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password must be at least 8 characters long, contain a lowercase letter, an uppercase letter, a number, and a special character');
            }
        }
    },
    age: {
        type: Number,
        min:1,
        max:100,
    },
    gender: {
        type: String,
        validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error('Invalid gender. Must be one of male, female, or other');
            }
        }
    },
    skills:{
        type: [String],
    }
},{timestamps:true});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"jwtTokenByShekar",{expiresIn: '7d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordbyUser){
    const user = this;
    const passwordHash = user.password;
    const passwordMatch = await bcrypt.compare(passwordbyUser, passwordHash);
    return passwordMatch;
}

module.exports = mongoose.model('User', userSchema);