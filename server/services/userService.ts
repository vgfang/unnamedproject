import db from "../config/pgConfig";

export const insertUserIfNotExists = async (
  email: string,
  username: string,
  discordId: string | null = null,
) => {
  const query = `
    INSERT INTO users (email, username, discord_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO NOTHING
    RETURNING *;
  `;
  const values = [email, username, discordId];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

export const selectUserUsingDiscordID = async (discordId: string) => {
  const query = `
    SELECT * FROM users
    WHERE discord_id = ($1);
  `;
  const values = [discordId];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
