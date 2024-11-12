import { FormEvent, useState } from "react";

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDiscordLogin = () => {
    window.location.href = "/auth/discord"; // Redirect to Discord OAuth route
  };

  const handleEmailPasswordFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
      isLoggingIn: isLoggingIn,
    };

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl">ghost lounge xyz</h1>
        <h1 className="text-2xl">[ ⩀☕ ]</h1>
      </div>
      <p className="">but all i feel is blame</p>
      <br />
      <span className="flex my-4 justify-center">
        <a
          onClick={() => setIsLoggingIn(true)}
          className={`text-xl px-2 py-1 cursor-pointer transition-colors duration-200 ${
            isLoggingIn
              ? "bg-black text-white font-bold"
              : "bg-transparent text-gray-500"
          }`}
        >
          login
        </a>
        <a
          onClick={() => setIsLoggingIn(false)}
          className={`text-xl px-2 py-1 cursor-pointer transition-colors duration-200 ${
            !isLoggingIn
              ? "bg-black text-white font-bold"
              : "bg-transparent text-gray-500"
          }`}
        >
          regis
        </a>
      </span>
      <form id="email-password-form" onSubmit={handleEmailPasswordFormSubmit}>
        <table className="my-4">
          <tbody>
            <tr>
              <td>
                <label>email: </label>
              </td>
              <td>
                <input
                  className="border-black border border-collapse"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>passw: </label>
              </td>
              <td>
                <input
                  className="border-black border border-collapse"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <button
        form="email-password-form"
        className="bg-black text-white px-4 py-2 rounded-md my-2"
      >
        {isLoggingIn && "login "}
        {!isLoggingIn && "register "}
        w/ email
      </button>
      <span className="">- or -</span>
      <button
        onClick={handleDiscordLogin}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-500 my-2"
      >
        {isLoggingIn && "login "}
        {!isLoggingIn && "register "}
        w/ discord
      </button>
      <br />
      {isLoggingIn && <a>forgot password?</a>}
      {!isLoggingIn && <span>\|^__^|/</span>}
    </div>
  );
};

export default Login;
