import mongoose from "mongoose";

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/chat-app'
const connectDB = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export default connectDB;