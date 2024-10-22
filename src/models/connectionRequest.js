const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status : {
        type: String,
        required: true,
        enum : {
            values: ["ignored", "intrested", "accepted", "rejected"],
            message: '{VALUE} is not a valid status',
        }
    }
},{timestamps: true});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself");
    }
    next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;