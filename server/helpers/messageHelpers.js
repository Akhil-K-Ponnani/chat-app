import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import chatModel from "../models/chatModel.js";

const messageHelpers = {
    sendMessage: (userId, content, chatId) => {
        return new Promise((resolve, reject) => {
            let message = {
                sender: userId,
                content: content,
                chat: chatId
            }
            messageModel.create(message).then(async (message) => {
                message = await message.populate("sender", "name email picture")
                message = await message.populate("chat")
                message = await userModel.populate(message, { path: "chat.users", select: "name picture email" })
                chatModel.findByIdAndUpdate(chatId, { latestMessage: message }).then(() => {
                    resolve(message)
                })
            })
        })
    },
    getAllMessages: (chatId) => {
        return new Promise(async (resolve, reject) => {
            let messages = await messageModel.find({ chat: chatId }).populate("sender", "name email picture").populate("chat")
            resolve(messages)
        })
    }
}

export default messageHelpers;