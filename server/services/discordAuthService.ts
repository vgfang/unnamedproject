import axios, { AxiosError } from "axios";
import * as TokenService from "./tokenService";

const getDiscordAccessTokenInfo = async (code: string, redirectURI: string) => {
  const discordUrl = `https://discord.com/api/oauth2/token`;
  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_CLIENT_ID as string);
  params.append("client_secret", process.env.DISCORD_CLIENT_SECRET as string);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectURI);

  try {
    const discordRes = await axios.post(discordUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return discordRes.data;
  } catch (err) {
    throw err;
  }
};

export const loginDiscord = async (code: string, redirectURI: string) => {
  try {
    // first, get the access token and info using code
    const discordInfo = await getDiscordAccessTokenInfo(code, redirectURI);
    console.log(discordInfo);
    return { message: "message" };
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data);
    }
    throw err;
  }

  // then, save access token
  // TokenService.getToken();
};
