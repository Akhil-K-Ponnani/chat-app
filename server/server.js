import express from "express";
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
app.listen(port, () => console.log(`Server started on Port ${port}`));