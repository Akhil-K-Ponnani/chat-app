import express from "express";
const router = express.Router();
import messageHelpers from "../helpers/messageHelpers.js";
import auth from "../middlewares/auth.js";

router.post("/", auth.userAuth, (req, res) => {
    if (req.body.content && req.body.chatId) {
        messageHelpers.sendMessage(req.user._id, req.body.content, req.body.chatId).then((message) =>
            res.status(200).json(message)
        )
    }
    else
        res.json(400).json({ message: "Please fill all the Fields." })
})

router.get("/:chatId", auth.userAuth, async (req, res) => {
    if (req.params.chatId) {
        let messages = await messageHelpers.getAllMessages(req.params.chatId)
        res.status(200).json(messages)
    }
    else
        res.status(400).json({ message: "Please fill ChatId." })
})

export default router;