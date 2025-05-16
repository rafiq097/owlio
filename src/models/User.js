import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    times: [String],
    leetcode: String,
    codechef: String,
    friends: [String],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;