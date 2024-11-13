import db from "../config/knex";
import { type Token, TokenType } from "../models/token";

export const upsertToken = async (
  user_id: number,
  type: TokenType,
  value: string,
  session_id: string,
  expiresIn: number | null = null,
) => {
  // upsert
  const query = `
    INSERT INTO tokens (user_id, type, value, session_id, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (user_id, type, session_id)
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
    session_id: session_id,
    expires_at: expiresAt,
  };

  const values = [
    token.user_id,
    token.type,
    token.value,
    token.session_id,
    token.expires_at,
  ];

  try {
    const result = await db.raw(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to insert token");
  }
};

export const upsertTokenObj = async (token: Token) => {
  let info = null;
  let expires_at = null;

  if ("info" in token) {
    info = token.info;
  }

  if ("expires_at" in token) {
    expires_at = token.expires_at;
  }

  // upsert
  const query = `
    INSERT INTO tokens (user_id, type, value, session_id, info, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (user_id, type, session_id)
    DO UPDATE SET value = EXCLUDED.value
    RETURNING *;
  `;

  const values = [
    token.user_id,
    token.type,
    token.value,
    token.session_id,
    info,
    expires_at,
  ];

  try {
    const result = await db.raw(query, values);
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
  session_id: string | null = null,
): Promise<Token | null> => {
  const query = `
    SELECT * FROM tokens
    WHERE user_id = ? 
    AND type = ?
    AND session_id = ?
  `;
  const values = [user_id, type, session_id];

  try {
    const result = await db.raw(query, values);
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0] as Token;
    }
  } catch (error) {
    throw new Error("Failed to get token.");
  }
};
