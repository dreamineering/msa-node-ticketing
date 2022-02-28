import request from "supertest";
import mongoose from "mongoose";

// Mocked
import { natsWrapper } from "../../nats-wrapper";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@stackmates/common";

const ticketId = new mongoose.Types.ObjectId().toHexString();

it("returns an error if the ticket does not exist", async () => {
  // arrange

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
    id: ticketId,
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
    id: ticketId,
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

it("emits an order created event", async () => {
  // arrange
  const ticket = Ticket.build({
    id: ticketId,
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // act
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  // assert
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
