import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, friends } = await req.json();

    if (!email || !Array.isArray(friends)) {
      return Response.json({ error: "Email and valid friends array are required" }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { friends },
      { new: true, upsert: true }
    );

    return Response.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update friends error:", error);
    return Response.json({ error: "Failed to update friends" }, { status: 500 });
  }
}
