import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as apiService from "../services/apiService";

const AuthDiscord = () => {
  const navigate = useNavigate();

  const redirect_uri = encodeURIComponent(
    `${window.location.origin}${window.location.pathname}`,
  );

  const OAuthUrl = `
    https://discord.com/oauth2/authorize?client_id=${
      import.meta.env.VITE_DISCORD_CLIENT_ID
    }&response_type=code&redirect_uri=${redirect_uri}&scope=email`;

  useEffect(() => {
    // check if env variable is set
    if (!("VITE_DISCORD_CLIENT_ID" in import.meta.env)) {
      alert("env variable DISCORD_OUTH_URL not set");
      return;
    }
    // check if token is in params, if not redirect to discord
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      window.location.href = OAuthUrl;
    } else {
      // TODO: session start, token
      apiService
        .loginWithDiscord(code)
        .then((result) => {
          console.log(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // navigate("/home");
    }
  }, [navigate]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Authenticating Discord...
      </h1>
    </>
  );
};

export default AuthDiscord;
