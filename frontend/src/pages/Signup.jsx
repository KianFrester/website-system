import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";
import { supabase } from "../api/CreateClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signUpNewUser(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/",
        },
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      return { success: false, error };
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
              Create Account
            </h2>
            <p className="text-gray-300">Join us and start your journey</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignUp} className="space-y-6 z-10 relative">
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
                  disabled={loading}
                  type="password"
                  placeholder="Create password"
                  required
                  className="w-full pl-10 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center text-sm">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
                />
                I agree to the{" "}
                <Link
                  to="/terms-and-privacy"
                  className="text-green-500 hover:text-green-400 font-medium"
                >
                  Terms of Service and Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Link to Sign In */}
            <p className="text-center text-gray-300">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Sign in
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
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={signUpWithGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaGoogle className="text-red-500" />
            Sign up with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
