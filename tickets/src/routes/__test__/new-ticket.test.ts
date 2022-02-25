// require("express-async-errors");
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("can only be accessed if the user is authenticated", async () => {
  // not authorised helper
  request(app).post("/api/tickets").send({}).expect(401);
});

it("returns status other than 401 if the user is signed in", async () => {
  const cookie = global.getAuthCookie();
  // console.log("cookie: ", cookie);

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
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Good thing",
      price: 30,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(30);
});

it("publishes an event", async () => {
  const title = "great stuff";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: title,
      price: 30,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
