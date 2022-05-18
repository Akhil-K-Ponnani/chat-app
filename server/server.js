import express from "express";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js"
import messageRoutes from "./routes/message.js"
import error from "./middlewares/error.js"

/* App Config */
const app = express();
const port = process.env.PORT || 5000;

/* Middlewares */
app.use(express.json())
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use(error.notFound);
app.use(error.errorHandler);

/* DB Connect */
connectDB.then((data) => console.log(`Database Connected: ${data.connection.host}`)).catch((err) => console.log(err));

/* Listener */
const server = app.listen(port, () => console.log(`Server started on Port ${port}`));

/* Socket.io Config */
const io = new Server(server, { pingTimeout: 60000 })
io.on("connection", (socket) => {
    console.log("Connected to Socket.io");
    socket.on("setup", (user) => {
        socket.join(user)
        socket.emit("connected")
        console.log("User Connected");
    })
    socket.on("join-chat", (chat) => {
        socket.join(chat)
        console.log(`User joined chat: ${chat}`);
    })
    socket.on("send-message", (message) => {
        message.chat.users.forEach((user) => {
            if (user._id !== message.sender._id)
                socket.in(user._id).emit("recieve-message", message)
        })
    })
    socket.on("typing", (chat) => socket.in(chat).emit("typing"))
    socket.on("stop-typing", (chat) => socket.in(chat).emit("stop-typing"))
    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(user)
    })
})