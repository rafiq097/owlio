import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, leetcode, codechef } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.leetcode = leetcode || existingUser.leetcode;
      existingUser.codechef = codechef || existingUser.codechef;
      await existingUser.save();
    } else {
      await User.create({ email, leetcode, codechef });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to save user" }, { status: 500 });
  }
}
