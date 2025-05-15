import { auth } from "@/auth";
import HomeClient from "./HomePage";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  return <HomeClient user={user} />;
}
