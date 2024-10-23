export enum TokenType {
  auth = "auth",
  discordAuth = "discordAuth",
  discordRefresh = "discordRefresh",
}

export interface Token {
  user_id: number;
  type: string;
  value: string | null;
  info?: string | null;
  expires_at: Date | null;
  created_at?: Date;
}
