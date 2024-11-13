import { v4 as uuidv4 } from "uuid";
import db from "../config/knex";
import type { User } from "../models/user";

export const insertUserIfNotExists = async (
  email: string,
  discordId: string | null = null,
  password: string | null = null,
) => {
  try {
    const defaultUsername = `user${uuidv4()}`;
    const result = await db("users")
      .insert({
        email: email,
        username: defaultUsername,
        discord_id: discordId,
        password: password,
      })
      .onConflict("email")
      .ignore()
      .returning("*");
    return result[0];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to insert user: ${err?.message}`);
    } else {
      throw err;
    }
  }
};

export const selectUserUsingDiscordID = async (discordId: string) => {
  try {
    const result = await db("users")
      .select("*")
      .where({ discord_id: discordId })
      .first();
    return result;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to select user using discordId: ${err?.message}`);
    } else {
      throw err;
    }
  }
};

export const selectUserUsingEmail = async (
  email: string,
): Promise<User | null> => {
  try {
    const result = await db("users")
      .select("*")
      .where({ email: email })
      .first();
    return result;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to select user using email: ${err?.message}`);
    } else {
      throw err;
    }
  }
};

export const selectUserUsingUsername = async (username: string) => {
  try {
    const result = await db("users")
      .select("*")
      .where({ username: username })
      .first();
    return result;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to select user using username: ${err?.message}`);
    } else {
      throw err;
    }
  }
};
