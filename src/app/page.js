import Navbar from "@/app/components/Navbar.js";
import LoginButton from "@/app/components/LoginButton";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Google OAuth Login</h1>
        <LoginButton />
      </div>
    </div>
  );
}