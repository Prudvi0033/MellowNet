import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient : req.user._id })
        .sort({createdAt : -1})
        .populate("realtedUser","name username profilePicture")
        .populate("realtedPost", "conetent image")

        res.status(200).json(notifications)
    } catch (error) {
        console.log("Error in getting notificationss", error)
    }   
} 

export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id
    try {
        const notification = await Notification.findByIdAndUpdate(
            {
                _id : notificationId, 
                recipient : req.user._id
            },
            {read : true},
            {new : true}
        )

        res.status(200).json(notification)
    } catch (error) {
        console.log("Error in mark as read notification");
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id

    try {
        await Notification.findOneAndDelete({
            _id : notificationId,
            recipient : req.user._id,
        })

        res.status(200).json("Notification deleted")
    } catch (error) {
        console.log("Error in deletion of notificaiton", error);
    }
} 