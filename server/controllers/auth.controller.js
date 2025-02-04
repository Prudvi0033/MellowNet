import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const {name, email, password, username} = req.body;
        const existingUser = await User.findOne({email})

        if(!name || !username || !email || !password){
            res.status(400).json({
                msg : "All fileds must be filled"
            })
        }
        
        if(existingUser){
            return res.status(200).json({
                msg : "User already exisits"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                msg : "Password must be atleast 6 Characters"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = new User ({
            name,
            email, 
            password: hashPassword,
            username
        })

        await user.save()

        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expiresIn:"3d"})
        res.cookie("jwt-mellow", token, {
            httpOnly: true,
            maxAge:  3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure : process.env.NODE_ENV === "production"
        })

        return res.status(200).json({
            msg : "Signup Succesfull",
            user,
            token
        })

        const profileUrl = process.env.CLIENT_URL + "/profile" + user.username

        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl)
        } catch (error) {
            console.log("Error sending email", error);
            
        }

    } catch (error) {
        console.log("Error in Signup Route", error);
        res.status(500).json({
            msg : "Internal Server err (Signup)"
        })
    }
}

export const login = (req, res) => {
    res.send("login")
}

export const logout = (req, res) => {
    res.send("logout")
}