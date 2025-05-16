import connectDB from "@/lib/db";
import User from "@/models/User";

function get() {
  const now = new Date();
  return now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

function check(str: any) {
  const date: any = new Date(str);
  const now: any = new Date();
  const diff = (now - date) / (1000 * 60 * 60 * 24);
  return diff <= 7;
}

export async function POST(req) {
  try {
    const { email, friends } = await req.json();

    if (!email || !Array.isArray(friends)) {
      return Response.json(
        { error: "Email and valid friends array are required" },
        { status: 400 }
      );
    }

    await connectDB();

    let updatedFriends = friends;
    const user = await User.findOne({ email });
    const time = get();

    if (user) {
      const combined = [...user.friends, ...friends];
      updatedFriends = [...new Set(combined)];

      const filteredTimes = (user.times || []).filter(check);

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { friends: updatedFriends, times: [...filteredTimes, time] } },
        { new: true, upsert: true }
      );

      return Response.json({ success: true, user: updatedUser });
    } else {
      const newUser = await User.create({ email, friends, times: [time] });
      return Response.json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error("Update friends error:", error);
    return Response.json(
      { error: "Failed to update friends" },
      { status: 500 }
    );
  }
}
