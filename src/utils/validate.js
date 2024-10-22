const validator = require('validator');

const validateFunction = (req) => {
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName) {
        throw new Error('Enter valid first name and last name');
    }else if(!validator.isEmail(email)){
        throw new Error('Enter valid email');
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Password should be strong');
    }
};

const validateEditProfileData = (req) => {
    const allowEditFields = ["firstName","lastName","age","gender","skills"];
    const isEditAllowed = Object.keys(req.body).every((field)=>allowEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {validateFunction,validateEditProfileData};