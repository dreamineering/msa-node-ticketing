import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { OrderStatus } from "@stackmates/common";

it("returns an error if the ticket does not exist", async () => {
  // arrange
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  // act
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({ ticketId });

  // assert
  expect(response.status).toEqual(404);
});

it("returns an error if the ticket is reserved", async () => {
  // arrange
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  ticket.save();

  const order = Order.build({
    ticket,
    userId: "asdfasdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  order.save();

  // act
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({ ticketId: ticket.id });

  // assert
  expect(response.status).toEqual(400);
});

it("reserves a ticket", async () => {
  // arrange
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // act
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({ ticketId: ticket.id });

  // assert
  expect(response.status).toEqual(201);
});
