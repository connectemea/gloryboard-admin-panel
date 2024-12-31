import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="flex items-center justify-center flex-col h-screen ">
        {/* bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 */}
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
          404
        </h1>
        <p className="text-xl mb-6 animate__animated animate__fadeIn animate__delay-2s">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex space-x-4 items-center justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-yellow-400 text-black rounded-lg shadow-lg transition duration-300 hover:bg-yellow-500 hover:shadow-2xl"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-blue-400 text-white rounded-lg shadow-lg transition duration-300 hover:bg-blue-500 hover:shadow-2xl"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
