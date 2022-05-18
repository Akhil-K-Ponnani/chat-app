import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";

/* App Config */
const app = express();
const port = process.env.PORT || 5000;

/* Middlewares */
app.use(express.json())
app.use("/user", userRoutes);
app.use((req, res, next) => {
    const error = new Error(`Not Found ${req.originalUrl}`)
    res.status(404)
    next(error)
});
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({ message: err.message, stack: process.env.NODE_ENV === "production" ? null : err.stack })
});

/* DB Connect */
connectDB.then((data) => console.log(`Database Connected: ${data.connection.host}`)).catch((err) => console.log(err));

/* Listener */
app.listen(port, () => console.log(`Server started on Port ${port}`));