import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

import * as TokenService from "./tokenService";
import * as UserService from "./userService";
import { TokenType } from "../models/token";
import { type User } from "../models/user";
import { query } from "express";

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

export const loginDiscord = async (
  code: string,
  redirectURI: string,
): Promise<User> => {
  try {
    // first, get the access token and info using code
    const discordTokenInfo = await getDiscordTokenInfo(code, redirectURI);
    console.log(discordTokenInfo);
    const accessToken = discordTokenInfo.access_token;

    // then, get info from discord
    const discordInfo = await getDiscordInfoUsingToken(accessToken);
    console.log(discordInfo);

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

    // then, save access token
    const tokenInfo = await TokenService.upsertToken(
      selectedUser.id,
      TokenType.discordAuth,
      accessToken,
      discordTokenInfo.expires_in,
    );
    console.log(tokenInfo);

    // lastly return user for setting session in controller
    return selectedUser;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    throw err;
  }
};
