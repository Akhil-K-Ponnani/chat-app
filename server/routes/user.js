import express from "express";
import userHelpers from "../helpers/userHelpers.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.get("/", auth.userAuth, async (req, res) => {
    if (req.query.search) {
        let users = await userHelpers.searchUser(req.query.search, req.user._id)
        res.status(200).json(users)
    }
    else
        res.status(400).send({ message: "The search query not found." })
});

router.post("/signup", (req, res) => {
    if (req.body.name && req.body.email && req.body.password) {
        userHelpers.userSignup(req.body).then((user) =>
            res.status(201).json(user)
        ).catch((error) =>
            res.status(400).send({ message: error })
        )
    }
    else
        res.status(400).send({ message: "The signup details not found." })
})

router.post("/login", (req, res) => {
    if (req.body.email && req.body.password) {
        userHelpers.userLogin(req.body).then((user) =>
            res.status(201).json(user)
        ).catch((error) =>
            res.status(400).send({ message: error })
        )
    }
    else
        res.status(400).send({ message: "The login details not found." })
})

export default router;