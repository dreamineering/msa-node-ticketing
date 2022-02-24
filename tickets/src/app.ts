import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { NotFoundError, currentUser, errorHandler } from "@stackmates/common";

import { createTicketRouter } from "./routes/new-ticket";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    name: "session",
  })
);
app.use(currentUser);

app.use(createTicketRouter);

app.all("*", async () => {
  throw new NotFoundError("This route does not exist");
});

app.use(errorHandler);

export { app };
