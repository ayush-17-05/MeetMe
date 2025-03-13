import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Sign Up
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm font-semibold text-red-400">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
