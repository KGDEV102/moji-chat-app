import mongoose from "mongoose";
export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTIONSTRING);
        console.log("Connected successfully");
    } catch (error) {
        console.log("Connected failed",error);
    }
}