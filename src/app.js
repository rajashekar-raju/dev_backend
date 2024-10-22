const express = require('express');
const connectDB = require('./config/database.js');
const app = express();
const User = require('./models/user.js');
const {validateFunction} = require('./utils/validate.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const {authFunction} = require('./middlewares/auth.js');

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require('./routes/connection.js');
const userRouter = require('./routes/user.js');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


// app.delete("/user",async (req, res)=>{
//     const userId = req.body.userId;
//     try {
//         // const user = await User.find({_id: userId});
//         const user = await User.findOneAndDelete(userId);
//         if(!user){
//             return res.status(404).send("User not found");
//         }
//         res.send(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error deleting user");
//     }
// });

// app.patch("/user/:userId", async (req, res) => {
//     const userId =  req.params?.userId;
//     const updatedUser = req.body;
//     try {
//         const ALLOWED_UPDATES = [
//             'lastName',
//             'password',
//             'age',
//             'gender'
//         ]

//         const isUpdateAllowed = Object.keys(updatedUser).every((key)=>{
//             ALLOWED_UPDATES.includes(key);
//         })
        
//         if(!isUpdateAllowed){
//             return res.status(400).send("Invalid updates");
//         }

//         // const user = await User.findByIdAndUpdate(userId, updatedUser, {new: true});
//         const user = await User.findByIdAndUpdate(userId, updatedUser,{returnDocument:'after'});

//         if(!user){
//             return res.status(404).send("User not found");
//         }
//         res.send("user updated successfully");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error updating user");
//     }
// })


connectDB().then(()=>{
    console.log("MongoDB connected successfully");
    app.listen(4000,()=>{
        console.log('Server running on port 4000');
    })
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
})

