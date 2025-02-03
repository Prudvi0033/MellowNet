import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {
        type : "String",
        required : true,
    },
    username : {
        type : "String",
        required : true,
        unique : true,
    },
    profilePicture : {
        type : "String",
        default : "",
    },
    bannerImg : {
        type : "String",
        default : "",
    },
    headline : {
        type : "String",
        default : "MellowNet User",
    },
    location : {
        type : "String",
        default : "Earth",
    },
    about : {
        type : "String",
        default : "Just a Chill Guy"
    },
    skills : [String],
    connections : {
        type : mongoose.Schema.Types.ObjectId, ref: "User"
    }
},{timestamps : true})

const User = mongoose.model("User",userSchema)

export default User