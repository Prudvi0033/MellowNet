import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-mellow"];

        if(!token){
            return res.status(400).json({
                msg : "Unauthorized - No token Provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            res.status(400).json({
                msg : "Invalid Token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            res.status(400).json({
                msg : "User not found"
            })
        }

        req.user = user
        next();
    } catch (error) {
        console.log("Error in Protect Route Middle");
        
    }
}