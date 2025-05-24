import React from "react";
import { useNavigate } from "react-router-dom";

const TermsAndPrivacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative">
      <button
        className="absolute top-4 left-4 flex items-center text-white/80 hover:text-white transition-colors"
        onClick={() => navigate("/signup")}
      >
        <svg
          className="h-5 w-5 mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Signup
      </button>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Terms of Service & Privacy Policy
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold text-green-500">
              Terms of Service
            </h3>
            <p className="text-gray-300 mt-4">
              These Terms of Service govern your use of our website and
              services. By accessing or using our services, you agree to these
              terms. If you do not agree with these terms, please do not use our
              services.
            </p>
            <p className="text-gray-300 mt-2">
              We reserve the right to modify these terms at any time. Any
              changes to the terms will be posted on this page, and the "last
              updated" date will reflect the changes.
            </p>
          </div>

          <div className="border-t border-white/20 my-8"></div>

          <div>
            <h3 className="text-2xl font-semibold text-green-500">
              Privacy Policy
            </h3>
            <p className="text-gray-300 mt-4">
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your personal information when you
              use our services.
            </p>
            <p className="text-gray-300 mt-2">
              We collect information that you provide directly to us when you
              sign up or interact with our services. This includes your name,
              email address, and other details you provide voluntarily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
