import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../api/CreateClient";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, signInUser, roles } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signInUser(email, password);
      console.log("Login result:", result);

      if (!result.success) {
        setError(result.error || "Invalid credentials");
        return;
      }

      setTimeout(() => {
        if (result.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/booking");
        }
      }, 100);
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      setError("An error occurred: " + error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-800 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-8">
          {/* Background blobs */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-green-500/20 rounded-full blur-3xl z-0"></div>
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-yellow-400/20 rounded-full blur-3xl z-0"></div>

          {/* Back Button */}
          <button
            className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center z-10"
            onClick={() => navigate("/")}
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8 z-10 relative">
            <h2 className="text-3xl font-bold text-white font-playfair">
              Welcome Back
            </h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {/* Sign-In Form */}
          <form onSubmit={handleSignIn} className="space-y-6 z-10 relative">
            <div className="space-y-4">
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Sign In
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Link to Signup */}
            <p className="text-center text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/10 text-gray-300">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Signin;
