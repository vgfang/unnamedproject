// keep user object lean, since it is used for session
// more info should be stored in userInfo
export interface User {
  id: number;
  discord_id: bigint | null;
  username: string;
  display_name: string | null;
  email: string;
  banned_at: Date;
  created_at: Date;
}
