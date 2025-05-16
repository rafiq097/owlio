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
    const { email, leetcode, codechef } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    const time = get();

    if (existingUser) {
      existingUser.leetcode = leetcode || existingUser.leetcode;
      existingUser.codechef = codechef || existingUser.codechef;

      const filteredTimes = (existingUser.times || []).filter(check);
      existingUser.times = [...filteredTimes, time];

      await existingUser.save();
    } else {
      await User.create({ email, leetcode, codechef, times: [time] });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to save user" }, { status: 500 });
  }
}
