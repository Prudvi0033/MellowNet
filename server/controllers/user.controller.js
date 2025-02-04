import User from "../models/user.model.js"

export const getSuggestedConnections = async (req,res) => {
    try {
        const currentUser =  await User.findById(req.user._id).select("collections")

        const suggestedUser = await User.find({
            _id:{
                $ne : req.user._id, $nin : currentUser.connections
            }
        }).select("name username profilePicture headline").limit(10) 

        res.json(suggestedUser)
    } catch (error) {
        console.log("Error in suggestions");
        res.status(400).json({
            msg : "Internal Server error"
        })
        
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username : req.params.username}).select("-password")

        if(!user){
            return res.status(404).json({
                msg : "User not found"
            })
        }

        res.json(user)
    } catch (error) {
        console.log("Error in getting public profile", error);
        res.status(500).json("Server error")
        
    }
}

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills"
        ]

        const updateData = {}

        for(const field of allowedFields){
            if(req.body[field]){
                updateData[field] = req.body[field]
            }
        }

        //check for profile and banner upload to cloudinary

        const user = await User.findByIdAndUpdate(req.user._id, {$set : updateData}, {new : true}).select("-password")

        res.json(user)
    } catch (error) {
        console.log("Error in update profile");
    }
}