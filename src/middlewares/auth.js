const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authFunction = async(req,res,next) => {
    try{
        const cookies = req.cookies;

        const {token} = cookies;

        if(!token){
            return res.status(401).send("Unauthorized");
        };

        const decodeMessage = jwt.verify(token,"jwtTokenByShekar");

        const {_id} = decodeMessage;

        const user = await User.findById(_id);

        if(!user){
            return res.status(404).send("User not found");
        }

        req.user = user;
        next();

    }catch(err){
        console.error(err);
        res.status(500).send("Error authenticating user");
    }

}
module.exports = {authFunction};