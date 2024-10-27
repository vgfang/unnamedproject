import axios from "axios";
import { v4 as uuidv4, v4 } from "uuid";

import * as TokenService from "./tokenService";
import * as AuthService from "./authService";
import * as UserService from "./userService";
import { TokenType } from "../models/token";
import { type User } from "../models/user";

// use code to get accessToken, refreshToken
const getDiscordTokenInfo = async (code: string, redirectURI: string) => {
  const discordUrl = `https://discord.com/api/oauth2/token`;
  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_CLIENT_ID as string);
  params.append("client_secret", process.env.DISCORD_CLIENT_SECRET as string);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectURI);
  params.append("scope", "identify email");

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

// use accessToken to get indentification and email
const getDiscordInfoUsingToken = async (accessToken: string) => {
  const discordProfileUrl = "https://discord.com/api/users/@me";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const discordRes = await axios.get(discordProfileUrl, { headers });
    return discordRes.data;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    throw err;
  }
};

// return JWTAccessToken using OAuth2 code and redirectURI
export const loginDiscord = async (
  code: string,
  redirectURI: string,
): Promise<string> => {
  try {
    // first, get the access token and info using code
    const discordTokenInfo = await getDiscordTokenInfo(code, redirectURI);
    const accessToken = discordTokenInfo.access_token;

    // then, get info from discord
    const discordInfo = await getDiscordInfoUsingToken(accessToken);

    // then, try to fetch user with that discordId
    let selectedUser = (await UserService.selectUserUsingDiscordID(
      discordInfo.id,
    )) as User;

    if (!selectedUser) {
      // if user does not exist, make a new user
      console.log("user does not exist");
      const defaultUsername = `user${uuidv4()}`;
      selectedUser = await UserService.insertUserIfNotExists(
        discordInfo.email,
        defaultUsername,
        discordInfo.id,
      );
    }

    // then, save discord access token
    await TokenService.upsertToken(
      selectedUser.id,
      TokenType.DiscordAccess,
      accessToken,
      "",
      discordTokenInfo.expires_in,
    );

    // then, save jwt access token and jwt refreshToken
    const newSessionId = uuidv4();
    const authResponse: AuthService.AuthResponse =
      await AuthService.createNewAccessAndRefreshTokens(
        selectedUser.id,
        newSessionId,
      );

    // lastly return encoded access JWT token to be saved on client
    if (authResponse.newAccessToken) {
      const encodedJWTAccessToken = AuthService.encodeJWTToken(
        selectedUser.id,
        newSessionId,
      );
      return encodedJWTAccessToken;
    } else {
      throw new Error("failed to generate jwt access");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    throw err;
  }
};
