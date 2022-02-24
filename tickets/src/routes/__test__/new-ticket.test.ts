// require("express-async-errors");
import request from "supertest";
import { app } from "../../app";

it("can only be accessed if the user is authenticated", async () => {
  // not authorised helper
  request(app).post("/api/tickets").send({}).expect(401);
});

it("returns status other than 401 if the user is signed in", async () => {
  const cookie = global.getAuthCookie();
  console.log("cookie: ", cookie);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  // expect(response.status).toEqual(200);
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "",
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Good thing",
      price: 0,
    });

  expect(response.status).toEqual(400);
});

it("creates a ticket with valid inputs", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Good thing",
      price: 30,
    })
    .expect(201);
});
