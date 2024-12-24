import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Welcome, {session.user.name}</p>
                <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
                    Sign Out
                </button>
            </div>
        );
    } else {
        return (
            <button onClick={() => signIn("google")} className="px-4 py-2 bg-blue-500 text-white rounded">
                Sign In with Google
            </button>
        );
    }
}
