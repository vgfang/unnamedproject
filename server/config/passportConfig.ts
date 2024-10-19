import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/auth/discord/callback",
      scope: ["identify", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // done(null, user);
});

export default passport;
