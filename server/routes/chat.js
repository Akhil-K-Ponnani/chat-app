import express from "express";
import chatHelpers from "../helpers/chatHelpers.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.get("/", auth.userAuth, async (req, res) => {
    let chats = await chatHelpers.getAllChats(req.user._id)
    res.status(200).json(chats)
})

router.post("/", auth.userAuth, async (req, res) => {
    let { userId } = req.body
    if (userId) {
        let chat = await chatHelpers.getChatDetails(req.user._id, userId)
        res.status(200).json(chat)
    }
    else
        res.status(400).json({ message: "Please fill UserId" })
})

router.post("/create-group", auth.userAuth, (req, res) => {
    if (req.body.users && req.body.name) {
        chatHelpers.createGroup(req.user._id, req.body.users, req.body.name).then((group) =>
            res.status(200).json(group)
        ).catch((error) =>
            res.status(400).json({ message: error })
        )
    }
    else
        res.status(400).json({ message: "Please fill all the Fields." })
})

router.put("/rename-group", auth.userAuth, (req, res) => {
    if (req.body.chatId && req.body.groupName) {
        chatHelpers.renameGroup(req.body.chatId, req.body.groupName).then((group) =>
            res.status(200).json(group)
        )
    }
    else
        res.status(400).json({ message: "Please fill all the Fields." })
})

router.put("/add-to-group", auth.userAuth, (req, res) => {
    if (req.body.chatId && req.body.userId) {
        chatHelpers.addToGroup(req.body.chatId, req.body.userId).then((group) =>
            res.status(200).json(group)
        )
    }
    else
        res.status(400).json({ message: "Please fill all the Fields." })
})

router.put("/remove-from-group", auth.userAuth, (req, res) => {
    if (req.body.chatId && req.body.userId) {
        chatHelpers.removeFromGroup(req.body.chatId, req.body.userId).then((group) =>
            res.status(200).json(group)
        )
    }
    else
        res.status(400).json({ message: "Please fill all the Fields." })
})

export default router;