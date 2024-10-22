import db from "../config/pgConfig";
import { TokenType } from "../models/token";

export const upsertToken = async (
  user_id: number,
  type: TokenType,
  value: string,
  expiresIn: number | null = null,
) => {
  // upsert
  const query = `
    INSERT INTO tokens (user_id, type, value, expires_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, type)
    DO UPDATE SET value = EXCLUDED.value
    RETURNING *;
  `;

  // if expiresIn is set (seconds), add to current time for expiresAt
  let expiresAt = null;
  if (expiresIn != null) {
    expiresAt = new Date(Date.now() + expiresIn * 1000);
  }
  const values = [user_id, type, value, expiresAt];

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
