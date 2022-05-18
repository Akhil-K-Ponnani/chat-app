import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const generateToken = (id) => {
    return jwt.sign({ id }, "chat-app-jwt", { expiresIn: "30d" })
}

const verifyToken = (token) => {
    return jwt.verify(token, "chat-app-jwt")
}

const userHelpers = {
    userSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ email: userData.email })
            if (user)
                reject("User already Exists.")
            else {
                userModel.create(userData).then((user) => {
                    user = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                        token: generateToken(user._id)
                    }
                    resolve(user)
                }).catch(() =>
                    reject("Signup Failed.")
                )
            }
        })
    },
    userLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ email: userData.email })
            if (user && (await user.verifyPassword(userData.password))) {
                user = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    token: generateToken(user._id)
                }
                resolve(user)
            }
            else
                reject("Invalid Email or Password.")
        })
    },
    authUser: (bearerToken) => {
        return new Promise(async (resolve, reject) => {
            let token
            token = bearerToken.split(" ")[1]
            let decodedToken = verifyToken(token)
            let user = await userModel.findById(decodedToken.id).select("-password")
            resolve(user)
        })
    },
    searchUser: (keyword, userId) => {
        return new Promise(async (resolve, reject) => {
            let users = await userModel.find({ $or: [{ name: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }] }).find({ _id: { $ne: userId } })
            resolve(users)
        })
    }
};

export default userHelpers;