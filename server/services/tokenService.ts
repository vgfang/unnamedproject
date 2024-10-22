import db from "../config/pgConfig";
import { TokenType } from "../models/token";

export const upsertToken = async (
  user_id: number,
  type: TokenType,
  value: string,
  discord_id = null,
) => {
  // upsert
  const query = `
    INSERT INTO tokens (user_id, type, value, discord_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, type)
    DO UPDATE SET value = EXCLUDED.value
    RETURNING *;
  `;
  const values = [user_id, type, value, discord_id];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to insert token");
  }
};

export const getToken = async (user_id: number, type: TokenType) => {
  const query = `
    SELECT FROM tokens
    WHERE user_id = $1
    AND type = $2
  `;
  const values = [user_id, type];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to get token.");
  }
};
