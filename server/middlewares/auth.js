import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

export default {
    userAuth: async (req, res, next) => {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let token
            token = req.headers.authorization.split(" ")[1]
            try {
                let decodedToken = jwt.verify(token, "chat-app-jwt")
                let user = await userModel.findById(decodedToken.id).select("-password")
                req.user = user
                next()
            } catch (error) {
                res.status(401).json({ message: error.message })
            }
        }
        else
            res.status(401).json({ message: "Token authorization Failed." })
    }
}