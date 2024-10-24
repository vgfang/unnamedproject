import db from "../config/pgConfig";
import { type Token, TokenType } from "../models/token";

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

  const token: Token = {
    user_id: user_id,
    type: type,
    value: value,
    expires_at: expiresAt,
  };

  const values = [token.user_id, token.type, token.value, token.expires_at];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to insert token");
  }
};

export const upsertTokenObj = async (token: Token) => {
  // TODO: update the fields to include all

  // upsert
  const query = `
    INSERT INTO tokens (user_id, type, value, expires_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, type)
    DO UPDATE SET value = EXCLUDED.value
    RETURNING *;
  `;
  const values = [token.user_id, token.type, token.value, token.expires_at];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to insert token");
  }
};

// return Token if found (unique so there can only be one)
// return null if not found
export const getToken = async (
  user_id: number,
  type: TokenType,
): Promise<Token | null> => {
  const query = `
    SELECT * FROM tokens
    WHERE user_id = $1
    AND type = $2
  `;
  const values = [user_id, type];

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0] as Token;
    }
  } catch (error) {
    throw new Error("Failed to get token.");
  }
};
