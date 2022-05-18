import jwt from "jsonwebtoken"

const generateToken = (id) => {
    return jwt.sign({ id }, "chat-app-jwt", { expiresIn: "30d" })
}

export default generateToken;