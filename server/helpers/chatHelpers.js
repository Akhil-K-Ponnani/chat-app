import chatModel from "../models/chatModel.js"

export default {
    getAllChats: (userId) => {
        return new Promise(async (resolve) => {
            let chats = await chatModel.find({
                users: { $elemMatch: { $eq: userId } }
            }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 })
            resolve(chats)
        })
    },
    startChat: (firstUserId, secondUserId) => {
        return new Promise(async (resolve) => {
            let chat = await chatModel.findOne({
                isGroup: false,
                users: { $elemMatch: { $eq: firstUserId } },
                users: { $elemMatch: { $eq: secondUserId } }
            }).populate("users", "-password").populate("latestMessage")
            if (chat)
                resolve(chat)
            else {
                let chatData = {
                    name: "sender",
                    isGroup: false,
                    users: [firstUserId, secondUserId]
                }
                chatModel.create(chatData).then(async (chat) => {
                    chat = await chatModel.findOne({ _id: chat._id }).populate("users", "-password")
                    resolve(chat)
                })
            }
        })
    },
    createGroupChat: (adminUserId, users, chatName) => {
        return new Promise((resolve, reject) => {
            users.push(adminUserId)
            if (users.length > 2) {
                chatModel.create({
                    name: chatName,
                    users: users,
                    isGroup: true,
                    groupAdmin: adminUserId
                }).then(async (groupChat) => {
                    groupChat = await chatModel.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")
                    resolve(groupChat)
                })
            }
            else
                reject("More than two users required to create a group chat")
        })
    },
    renameGroupChat: (chatId, groupName) => {
        return new Promise((resolve) => {
            chatModel.findByIdAndUpdate(chatId, { name: groupName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password").then((groupChat) => {
                resolve(groupChat)
            })
        })
    },
    addToGroupChat: (chatId, userId) => {
        return new Promise((resolve) => {
            chatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password").then((groupChat) => {
                resolve(groupChat)
            })
        })
    },
    removeFromGroupChat: (chatId, userId) => {
        return new Promise((resolve) => {
            chatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password").then((groupChat) => {
                resolve(groupChat)
            })
        })
    }
}