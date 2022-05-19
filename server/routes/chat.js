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
        let chat = await chatHelpers.startChat(req.user._id, userId)
        res.status(200).json(chat)
    }
    else
        res.status(400).send({ message: "The userId not found." })
})

router.post("/create-group", auth.userAuth, (req, res) => {
    if (req.body.users && req.body.name) {
        chatHelpers.createGroupChat(req.user._id, req.body.users, req.body.name).then((group) =>
            res.status(200).json(group)
        ).catch((error) =>
            res.status(400).send({ message: error })
        )
    }
    else
        res.status(400).send({ message: "The users or name not found." })
})

router.put("/rename-group", auth.userAuth, (req, res) => {
    if (req.body.chatId && req.body.groupName) {
        chatHelpers.renameGroupChat(req.body.chatId, req.body.groupName).then((groupChat) =>
            res.status(200).json(groupChat)
        )
    }
    else
        res.status(400).send({ message: "The chatId or groupName not found." })
})

router.put("/add-to-group", auth.userAuth, (req, res) => {
    if (req.body.chatId && req.body.userId) {
        chatHelpers.addToGroupChat(req.body.chatId, req.body.userId).then((groupChat) =>
            res.status(200).json(groupChat)
        )
    }
    else
        res.status(400).send({ message: "The chatId or userId not found." })
})

router.put("/remove-from-group", auth.userAuth, (req, res) => {
    if (req.body.chatId && req.body.userId) {
        chatHelpers.removeFromGroupChat(req.body.chatId, req.body.userId).then((groupName) =>
            res.status(200).json(groupName)
        )
    }
    else
        res.status(400).send({ message: "The chatId or userId not found." })
})

export default router;