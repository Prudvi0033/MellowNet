import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required : true
    },
    type : {
        type : String,
        required : true,
        enum : ["like", "comment", "connectionAccepted"]
    },
    relatedPost : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
    },
    read : {
        type : Boolean,
        default : false
    }
    
})