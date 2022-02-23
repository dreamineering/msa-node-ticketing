import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHander, NotFoundError } from "@stackmates/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.all("*", async () => {
  throw new NotFoundError("This route does not exist");
});

app.use(errorHander);

export { app };
