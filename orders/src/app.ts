import express, { Router } from "express";
import "express-async-errors";
import { json } from "body-parser";

// https://github.com/expressjs/cookie-session
// WARNING: NEEDED TO GO BACK TO OLDER VERSION 1.4 AS 2.x WAS NOT WORKING
import cookieSession from "cookie-session";

import { NotFoundError, currentUser, errorHandler } from "@stackmates/common";

import { indexOrderRouter } from "./routes/order-index";
import { createOrderRouter } from "./routes/new-order";
import { showOrderRouter } from "./routes/show-order";
import { deleteOrderRouter } from "./routes/delete-order";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, //secure: process.env.NODE_ENV !== "test",
    name: process.env.NODE_ENV === "test" ? "" : "session",
  })
);
app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  // console.log("ticket app: route not found");
  throw new NotFoundError("This route does not exist");
});

app.use(errorHandler);

export { app };
