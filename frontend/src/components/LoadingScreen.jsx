const LoadingScreen = ({ message = "Loading Please Wait..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
