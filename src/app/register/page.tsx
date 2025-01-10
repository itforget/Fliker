"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { Spinner } from "@phosphor-icons/react";
import axios from "axios";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain letters and at least one special character"
    ),
});

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
    });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/user/register", {  name, email, password });

      if (res.status === 201) {
        router.push("/");
      } else {
        setError(res.data.message || "Registration failed. Please try again.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "An unexpected error occurred. Please try again later."
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Register
      </h1>
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={handleRegister}
            className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {!loading ? (
              "Register"
            ) : (
              <div className="flex justify-center">
                <Spinner className="animate-spin h-5 w-5 text-white" />
              </div>
            )}
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-green-500 hover:text-green-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
