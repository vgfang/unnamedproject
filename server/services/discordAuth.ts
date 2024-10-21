import axios from "axios";
import * as TokenService from "../services/tokenService";

const getDiscordAccessTokenInfo = async (code: string) => {
  const discordUrl = `https://discord.com/api/oauth2/token`;
  const redirectURI = encodeURIComponent("");

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
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching access token: ", error.message);
    }
    throw new Error("Failed to fetch access token");
  }
};

export const loginDiscord = async (code: string) => {
  // first, get the access token and info using code
  const discordInfo = getDiscordAccessTokenInfo(code);
  console.log(discordInfo);

  // then, save access token
  // TokenService.getToken();
};
