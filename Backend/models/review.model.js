import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewText: String,
    reviewAuthor: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Review", reviewSchema)