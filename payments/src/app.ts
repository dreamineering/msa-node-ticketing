import express, { Router } from "express";
import "express-async-errors";
import { json } from "body-parser";

// https://github.com/expressjs/cookie-session
// WARNING: NEEDED TO GO BACK TO OLDER VERSION 1.4 AS 2.x WAS NOT WORKING
import cookieSession from "cookie-session";

import { NotFoundError, currentUser, errorHandler } from "@stackmates/common";

import { createPaymentRouter } from "./routes/new-payment";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // process.env.NODE_ENV !== "test",
    name: process.env.NODE_ENV === "test" ? "" : "session",
  })
);
app.use(currentUser);

// app routes
app.use(createPaymentRouter);

app.all("*", async () => {
  // console.log("ticket app: route not found");
  throw new NotFoundError("This route does not exist");
});

app.use(errorHandler);

export { app };
