import db from "../config/pgConfig";
import { TokenType } from "../models/token";

export const insertToken = async (
  user_id: number,
  type: TokenType,
  value: string,
) => {
  const query = `
    INSERT INTO tokens (user_id, type, value)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [user_id, type, "tokenValue"];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to insert token.");
  }
};
