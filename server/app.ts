import express from "express";
import session from "express-session";
import routes from "./routes/routes";

import { type Express } from "express";

const app: Express = express();

// json middleware
app.use(express.json());

// sessions setup
app.use(
  session({
    secret: "4a119710-edec-4b5c-a8a7-1e2f09ed2b1e",
    resave: false,
    saveUninitialized: true,
  }),
);

// routes
app.use("/", routes);

export default app;
