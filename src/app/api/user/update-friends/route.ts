import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, friends } = await req.json();

    if (!email || !Array.isArray(friends)) {
      return Response.json({ error: "Email and valid friends array are required" }, { status: 400 });
    }

    await connectDB();

    let updatedFriends = friends;
    const user = await User.findOne({ email });

    if (user) {
      const combined = [...user.friends, ...friends];
      updatedFriends = [...new Set(combined)];
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { friends: updatedFriends } },
        { new: true, upsert: true }
      );
      return Response.json({ success: true, user: updatedUser });
    }
    else {
      const newUser = await User.create({ email, friends });
      return Response.json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error("Update friends error:", error);
    return Response.json({ error: "Failed to update friends" }, { status: 500 });
  }
}
