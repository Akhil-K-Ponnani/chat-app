import generateToken from "../config/jwt.js";
import userModel from "../models/userModel.js";

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
    searchUser: (keyword, userId) => {
        return new Promise(async (resolve, reject) => {
            let users = await userModel.find({
                _id: { $ne: userId },
                $or: [{ name: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }]
            })
            resolve(users)
        })
    }
};

export default userHelpers;