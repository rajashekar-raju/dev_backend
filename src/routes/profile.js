const express = require('express');
const profileRouter = express.Router();
const {authFunction} = require("../middlewares/auth");
const User = require("../models/user");
const {validateEditProfileData} = require("../utils/validate")
profileRouter.get("/profile",authFunction,async (req,res)=>{
    try {
        const user = req.user;
        res.send(user);
    }catch(err){
        console.error(err);
        res.status(500).send("Error retrieving profile");
    };
})

profileRouter.get("/user",async (req, res)=>{
    // const emailId = req.body.email;
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users");
    }
});

profileRouter.patch("/profile/edit",authFunction,async (req,res)=>{
    try{if(!validateEditProfileData(req)){
        throw new Error("invalid field to update");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send(loggedInUser);
}
    catch(err){
        console.error(err);
        res.status(400).send("Invalid update");
    }
})

module.exports = profileRouter;