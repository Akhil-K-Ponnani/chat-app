import chatModel from "../models/chatModel.js"

const chatHelpers = {
    getAllChats: (userId) => {
        return new Promise(async (resolve, reject) => {
            let chats = await chatModel.find({
                users: { $elemMatch: { $eq: userId } }
            }).populate("users").populate("latestMessage", "groupAdmin").sort({ updatedAt: -1 })
            chats = await chatModel.populate(chats, { path: "latestMessage.sender", select: "name email picture" })
            resolve(chats)
        })
    },
    getChatDetails: (firstUserId, secondUserId) => {
        return new Promise(async (resolve, reject) => {
            let chat = await chatModel.find({
                isGroup: false,
                users: { $elemMatch: { $eq: firstUserId } },
                users: { $elemMatch: { $eq: secondUserId } }
            }).populate("users", "-password").populate("latestMessage")
            chat = await chatModel.populate(chat, { path: "latestMessage.sender", select: "name email picture" })
            if (chat.length > 0)
                resolve(chat[0])
            else {
                let chatData = {
                    name: "sender",
                    isGroup: false,
                    users: [firstUserId, secondUserId]
                }
                chatModel.create(chatData).then(async (chat) => {
                    chat = await chatModel.find({ _id: chat._id }).populate("users", "-password")
                    resolve(chat)
                })
            }
        })
    },
    createGroup: (adminUserId, users, chatName) => {
        return new Promise((resolve, reject) => {
            users.push(adminUserId)
            if (users.length > 2) {
                chatModel.create({
                    name: chatName,
                    users: users,
                    isGroup: true,
                    groupAdmin: adminUserId
                }).then(async (group) => {
                    group = await chatModel.findOne({ _id: group._id }).populate("users", "-password").populate("groupAdmin", "-password")
                    resolve(group)
                })
            }
            else
                reject("More than two users required to create a group chat")
        })
    },
    renameGroup: (chatId, groupName) => {
        return new Promise((resolve, reject) => {
            chatModel.findByIdAndUpdate(chatId, { name: groupName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password").then((group) => {
                resolve(group)
            })
        })
    },
    addToGroup: (chatId, userId) => {
        return new Promise((resolve, reject) => {
            chatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password").then((group) => {
                resolve(group)
            })
        })
    },
    removeFromGroup: (chatId, userId) => {
        return new Promise((resolve, reject) => {
            chatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password").then((group) => {
                resolve(group)
            })
        })
    }
}

export default chatHelpers;