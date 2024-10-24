export enum TokenType {
  // jwtTokens are used our application
  JwtAuth = "JwtAccess",
  JwtRefresh = "JwtRefresh",
  DiscordAccess = "DiscordAccess",
  DiscordRefresh = "DiscordRefresh",
}

export interface Token {
  user_id: number;
  type: string;
  value: string | null;
  info?: string | null;
  expires_at: Date | null;
  created_at?: Date;
}
