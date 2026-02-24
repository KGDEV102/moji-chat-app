import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshToken: {
        type: String,
        require: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Session = mongoose.model("Session", sessionSchema);