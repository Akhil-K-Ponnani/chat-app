import express from 'express';
import connectDB from './config/db.js';
import userRouter from './routes/user.js';

/* App Config */
const app = express();
const port = process.env.PORT || 5000;

/* Middlewares */
app.use('/', userRouter);

/* DB Connect */
connectDB.then((data) => console.log(`Database Connected: ${data.connection.host}`)).catch((err) => console.log(err))

/* Listener */
app.listen(port, () => console.log(`Server started on Port ${port}`));