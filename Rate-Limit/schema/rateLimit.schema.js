import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    requests: {
        type: Number,
        default: 0
    },
    windowStart: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

export default mongoose.model("RateLimit", RateLimitSchema);
