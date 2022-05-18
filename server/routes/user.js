import express from "express";
import userHelpers from "../helpers/userHelpers.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.get("/", auth.userAuth, async (req, res) => {
    if (req.query.search) {
        let users = await userHelpers.searchUser(req.query.search, req.user._id)
        res.status(200).json(users)
    }
});

router.post("/signup", (req, res) => {
    if (req.body.name && req.body.email && req.body.password) {
        userHelpers.userSignup(req.body).then((user) =>
            res.status(201).json(user)
        ).catch((error) =>
            res.status(400).json({ message: error })
        )
    }
    else
        res.status(400).json({message:"Please fill all the Fields."})
})

router.post("/login", (req, res) => {
    if (req.body.email && req.body.password) {
        userHelpers.userLogin(req.body).then((user) =>
            res.status(201).json(user)
        ).catch((error) =>
            res.status(400).json({ message: error })
        )
    }
    else
        res.status(400).json({ message: "Please fill all the Fields." })
})

export default router;