const Login: React.FC = () => {
  const handleDiscordLogin = () => {
    window.location.href = "/auth/discord"; // Redirect to Discord OAuth route
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <button
          onClick={handleDiscordLogin}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-500"
        >
          Login with Discord
        </button>
      </div>
    </div>
  );
};

export default Login;
