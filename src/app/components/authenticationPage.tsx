import Link from "next/link";

export default function AuthenticationPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold mb-4">Authentication</h1>
            <p className="text-lg mb-6">Log in or sign up to access the app</p>
            <div className="space-x-4">
                <Link className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" href="/login">
                    Log in
                </Link>
                <Link className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" href="/register">
                    Sign up
                </Link>
            </div>
        </div>
    )
}