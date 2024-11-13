import db from "../config/knex";

export const insertUserIfNotExists = async (
  email: string,
  username: string,
  discordId: string | null = null,
) => {
  const query = `
    INSERT INTO users (email, username, discord_id)
    VALUES (?, ?, ?)
    ON CONFLICT (email) DO NOTHING
    RETURNING *;
  `;
  const values = [email, username, discordId];

  try {
    const result = await db.raw(query, values);
    return result.rows[0];
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
