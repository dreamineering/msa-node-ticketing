// require("express-async-errors");
import request from "supertest";
import { app } from "../../app";

it("can only be accessed if the user is authenticated", async () => {
  // not authorised helper
  request(app).post("/api/tickets").send({}).expect(401);
});

it("returns status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

xit("returns an error if an invalid title is provided", async () => {});
xit("returns an error if an invalid price is provided", async () => {});
xit("creates a ticket with valid inputs", async () => {});
