import Connection from "../models/connnection.model.js"
import User from "../models/user.model.js"

export const sendConnectionRequest = async (req, res) => { 
    try {
        const { userId } = req.params
        const senderId = req.user._id

        if (senderId.toString() === userId) {
            return res.status(400).json({
                msg: "You can't send a rqst to yourself"
            })
        }

        const existingRequest = await Connection.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending"
        })


        if (existingRequest) {
            return res.status(400).json({
                msg: "a connection rqst already exisits"
            })
        }

        const newRequest = new Connection({
            sender: senderId,
            recipient: userId
        })

        await newRequest.save()
    } catch (error) {
        console.log("Error in sending commection rqst", error);

    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params
        const userId = req.user._id

        const request = await Connection.findById(requestId)
            .populate("sender", "name email username")
            .populate("recipient", "name username")

        if (!request) {
            res.json({ msg: "request not found" })
        }

        if (request.recipient._id.toString() !== userId.toString()) {
            return res.status(400).json({
                msg: "Not authorized to accept this rqst"
            })
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                msg: "This rqst has already been processed"
            })
        }

        request.status = "accepted";
        await request.save()

        await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: userId } })
        await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } })

        const notification = new Notification({
            recipient: request.sender._id,
            type: "connectionAccepted",
            relatedUser: userId
        })

        await notification.save()

        res.json({ msg: "Connection accepted succesfully" })
    } catch (error) {
        console.log("Error in accepting connection rqst");

    }
}

export const rejectConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params
        const userId = req.user._id

        const request = await Connection.findById(requestId)

        if (request.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "Not authorized to reject this rqst" })
        }

        if (request.status != "pending") {
            return res.status(400).json({ msg: "This rqst has already been processed" })
        }

        request.status = "rejected"
        await request.save()

        res.json({ msg: "Connection rqst has been rejected" })
    } catch (error) {
        console.log("Error in reject connection rqst", error);
    }
}

export const getConnectionReqests = async (req, res) => {
    try {
        const userId = req.user._id

        const requests = await Connection.find({
            recipient: userId,
            status: "pending"
        })
            .populate("sender", "name username profilePicture headline connections")

        res.json(requests)
    } catch (error) {
        console.log("Error in getting all connections");
    }
}

export const getUserConnection = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
            .populate("connections", "name username profilePicture headline connections")

        res.json(user.connections)
    } catch (error) {
        console.log("Error in getting user connections", error);
    }
}
export const removeConnection = async (req, res) => {
    try {
        const myId = req.user._id
        const {userId} = req.params

        await User.findByIdAndUpdate(myId, {$pull : {connections: userId}})
        await User.findByIdAndUpdate(userId, {$pull: {connections : myId}})

        res.json({
            msg : "Connection removed succesfully"
        })
    } catch (error) {
        console.log("Error in removing connection");
    }
}
export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId
        const currentUserId = req.user._id

        const currentUser = req.user

        if(currentUser.connections.includes(targetUserId)){
            return res.json({status : "connected"})
        }

        const pendingRequest = await Connection.findOne({
            $or:[
                {sender : currentUserId, recipient : targetUserId},
                {sender : targetUserId, recipient : currentUserId}
            ],
            status : "pending"
        })

        if(pendingRequest){
            return res.json({
                status : "pending"
            })
        }
        else{
            return res.json({
                status : "recieved",
                requestId: pendingRequest._id
            })
        }

        res.json({
            status : "not connected"
        })
    } catch (error) {
        console.log("Error in get connection rqsts", error); 
    }
} 
