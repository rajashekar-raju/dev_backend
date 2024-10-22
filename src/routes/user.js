const express = require('express');
const { authFunction } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
userRouter.get("/user/requests/received",authFunction,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId","firstName lastName age gender"); // here iam not getting age and gender
        // }).populate("fromUserId",["firstName", "lastName","age","gender"]);

        res.json({
            message:"Data fetched successfully",
            data:connectionRequests
        })

    }catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})

userRouter.get("/user/connections",authFunction,async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id,status:"accepted"},
                {toUserId: loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName").populate("toUserId","firstName lastName");

        // console.log(connectionRequests);

        const data = connectionRequests.map((row) => {
            // console.log('From UserId:', row.fromUserId._id.toString());  // Debugging
            // console.log('To UserId:', row.toUserId._id.toString());      // Debugging
            // console.log('Logged in User ID:', loggedInUser._id.toString()); // Debugging
        
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });
        

        console.log(data);

        res.json({
            message:"Data fetched successfully",
            data
        })

    }catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})

userRouter.get("/feed",authFunction,async(req,res)=>{
    try{
        loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });
        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id:{$nin: loggedInUser._id}}
            ]
        }).select("firstName lastName age gender").skip(skip).limit(limit);
        res.send(users);
    }catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})


module.exports = userRouter;