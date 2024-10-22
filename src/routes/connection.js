const express = require('express');
const requestRouter = express.Router();
const {authFunction} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
requestRouter.post("/request/send/:status/:toUserId",authFunction,async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId:fromUserId,
            toUserId:toUserId,
            status:status,
        })

        const allowedStatus = ["intrested","ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status "+status});
        }

        const toUSer = await User.findById(toUserId);

        if(!toUSer){
            return res.status(404).json({message:"User not found"});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        });

        if(existingConnectionRequest){
            return res.status(400).json({message:"Request already exists"});
        }

        const data = await connectionRequest.save();

        res.json({
            message: "Request sent successfully",
            data
        })

    }catch(err){
        console.error(err);
        res.status(500).send("Error sending request");
    }
})

requestRouter.post("/request/review/:status/:requestId",authFunction,async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const {_id} = loggedInUser;
        const requestId = req.params.requestId;
        const status = req.params.status;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status "+status});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:_id,
            status:"intrested"
        })
        if(!connectionRequest){
         return res.status(404).json({message:"Request not found or already reviewed"});
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(404).json({
            message: `Request ${status} successfully`,
            data
        })
        // res.send("added successfully");
    }catch(err){
        console.error(err);
        res.status(500).send("Error fetching user");
    }
})
module.exports = requestRouter; 