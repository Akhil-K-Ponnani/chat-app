import express from "express";
import userHelpers from "../helpers/userHelpers.js";
const router = express.Router();

const verifyUser = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        userHelpers.authUser(req.headers.authorization).then((user) => {
            req.user = user
            next()
        })
    }
    else
        res.status(401).json({ message: "Token authorization Failed." })
}

/* GET home */
router.get("/", verifyUser, async (req, res) => {
    if (req.query.search) {
        let users = await userHelpers.searchUser(req.query.search, req.user._id)
        res.status(200).json(users)
    }
});

/* POST signup */
router.post("/signup", (req, res) => {
    userHelpers.userSignup(req.body).then((user) =>
        res.status(201).json(user)
    ).catch((error) =>
        res.status(400).json({ message: error })
    )
})

/* POST login */
router.post("/login", (req, res) => {
    userHelpers.userLogin(req.body).then((user) =>
        res.status(201).json(user)
    ).catch((error) =>
        res.status(400).json({ message: error })
    )
})

export default router;