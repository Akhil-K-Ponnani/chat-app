import messageModel from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";

export default {
    sendMessage: (userId, content, chatId) => {
        return new Promise((resolve) => {
            let message = {
                sender: userId,
                content: content,
                chat: chatId
            }
            messageModel.create(message).then(async (message) => {
                message = await message.populate("sender", "-password")
                message = await message.populate("chat")
                chatModel.findByIdAndUpdate(chatId, { latestMessage: message._id }).then(() => {
                    resolve(message)
                })
            })
        })
    },
    getAllMessages: (chatId) => {
        return new Promise(async (resolve) => {
            let messages = await messageModel.find({ chat: chatId }).populate("sender", "-password").populate("chat")
            resolve(messages)
        })
    }
}