import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

const ticketId = new mongoose.Types.ObjectId().toHexString();

it("fetches an order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: ticketId,
    title: "concert",
    price: 20,
  });
  ticket.save();

  // make a request to build an order with this ticket
  const user = global.getAuthCookie();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // act
  // make a request to fetch the order
  const { body: getOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(getOrder.id).toEqual(order.id);
});

it("returns 401 when a user tries access another users order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: ticketId,
    title: "concert",
    price: 20,
  });
  ticket.save();

  // make a request to build an order with this ticket
  const user = global.getAuthCookie();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // act and assert
  // a different user cannot fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.getAuthCookie())
    .expect(401);
});
