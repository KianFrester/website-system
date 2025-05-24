import React from "react";

const LoadingScreen = ({ message = "Loading Please Wait..." }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-50">
      <div
        className="w-20 h-20 rounded-full border-8 border-green-500 border-t-transparent animate-spin"
        style={{
          borderImage: "linear-gradient(45deg, #4ade80, #22c55e) 1",
          borderImageSlice: 1,
        }}
      ></div>
      <p className="mt-6 text-white text-xl font-semibold tracking-wide select-none">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;
