import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "accepted", "rejected"],
        default : "pending"
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
},{timestamps : true})

const Connection = mongoose.model("Connection",connectionSchema)

export default Connection