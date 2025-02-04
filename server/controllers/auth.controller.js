import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"

export const signup = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                msg: "All fields must be filled"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                msg: "Password must be at least 6 characters"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashPassword,
            username
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("jwt-mellow", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

        try {
            // await sendWelcomeEmail(user.email, user.name, profileUrl); //turn this on later
        } catch (error) {
            console.log("Error sending email", error);
        }

        return res.status(201).json({
            msg: "Signup successful",
            user,
            token
        });

    } catch (error) {
        console.log("Error in Signup Route", error);
        return res.status(500).json({
            msg: "Internal server error (Signup)"
        });
    }
};


export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username })

        if (!user) {
            res.status(400).json({
                msg: "User doesn't exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                msg: "Invalid Credentials"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
        await res.cookie("jwt-mellow", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.json({
            msg: "Sucessfully Loged-In"
        })
    } catch (error) {
        console.log("Error in Login", error);
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt-mellow")
    res.json({
        msg: "Logout Succesfull"
    })
}