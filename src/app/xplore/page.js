import XplorePage from "@/app/components/Xplore.js";
import { auth } from "@/auth";

export default async function Xplore() {
  const session = await auth();
  const user = session?.user;

  return (
    <div>
      <XplorePage user={user} />
    </div>
  );
}
