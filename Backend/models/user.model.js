import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    location: String,
    email: String,
    password: String,
    type: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
})

export default mongoose.model("User", userSchema)