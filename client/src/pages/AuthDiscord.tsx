import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as apiService from "../services/apiService";
import * as toastService from "../services/toastService";
import { toast } from "react-toastify";

const AuthDiscord = () => {
  const navigate = useNavigate();

  const redirectUri = `${window.location.origin}${window.location.pathname}`;

  const OAuthUrl = `
    https://discord.com/oauth2/authorize?client_id=${
      import.meta.env.VITE_DISCORD_CLIENT_ID
    }&response_type=code&redirect_uri=${redirectUri}&scope=identify+email`;

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
      apiService
        .loginWithDiscord(code, redirectUri)
        .then((result) => {
          console.log(result.data);
          // store the jwt access token in local storage
          if (result.data?.jwtAccess) {
            localStorage.setItem("jwtAccess", result.data.jwtAccess);
            navigate("/home");
          } else {
            toastService.error("Error getting access token");
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
