const express = require('express');
const authRouter = express.Router();
const {validateFunction} = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup",async (req, res)=>{

    try {
        
        validateFunction(req);
        
        const {firstName, lastName, email, password} = req.body;
        
        // encrypt the password 
        const passwordHash = await bcrypt.hash(password,10);
        
        // create new instance of the user model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        res.send("User registered successfully");
    }catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
})

authRouter.post("/login",async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).send("invalid credentials");
        }
        const passwordMatch = await user.validatePassword(password);
        if(passwordMatch){
            
            // create jwt token
            const jwtToken = await user.getJWT();
            
            // add token to cookies 
            res.cookie("token", jwtToken);

            res.send("Logged in successfully");
        }else{
            return res.status(404).send("invalid credentials");
        }
    }catch(err){
        console.error(err);
        res.status(500).send("Error logging in");
    }
});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())}),
    res.send("Logged out successfully");
}) 
module.exports = authRouter;