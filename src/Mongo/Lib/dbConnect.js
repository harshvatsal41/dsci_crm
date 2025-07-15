import mongoose from 'mongoose';

let isConnected = false; // Maintain the connection state

const connectDB = async () => {
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }

    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
        throw new Error("Database credentials are missing in environment variables");
    }

    try {
        const db = await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 30000, // Increase socket timeout
        });
        isConnected = db.connection.readyState === 1; // 1 means connected
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}


export default connectDB;