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
      {loading && <LoadingScreen />}{" "}
      <div className="min-h-screen bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90 flex items-center justify-center p-4 relative">
        

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

          <button
            className="absolute top-4 left-4 flex items-center text-white/80 hover:text-white transition-colors cursor-pointer"
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

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer"
            >
              Sign In
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <p className="text-center text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-500 hover:text-green-400 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/10 text-gray-300">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
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
