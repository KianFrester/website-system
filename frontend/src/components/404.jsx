import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <svg
          className="w-24 h-24 mx-auto text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h1 className="mt-6 text-6xl font-bold">404</h1>
        <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-4 max-w-md mx-auto text-gray-300">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <Link to="/" className="inline-block mt-8">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-md transition duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Return to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
