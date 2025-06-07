import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        console.log("Already connected to the database.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // process.exit(1);
    }
};

export default connectDB;
