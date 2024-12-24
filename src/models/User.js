import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    leetcode: String,
    codechef: String,
    friends: [
        {
            name: { type: String, },
            leetcode: { type: String, },
            codechef: { type: String, },
        },
    ]
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;