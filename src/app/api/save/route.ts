import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({ email });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to save user" }, { status: 500 });
  }
}
