import db from "../config/pgConfig";
import { TokenType } from "../models/token";

export const upsertToken = async (
  user_id: number,
  type: TokenType,
  value: string,
) => {
  // upsert
  const query = `
    INSERT INTO tokens (user_id, type, value)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, type)
    DO UPDATE SET value = EXCLUDED.value
    RETURNING *;
  `;
  const values = [user_id, type, value];

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
