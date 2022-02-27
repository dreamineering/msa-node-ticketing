import request from "supertest";

import { OrderStatus } from "@stackmates/common";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

it.todo("has 400 if an order cannot be found");

it.todo("has 404 if a User that is not an Owner tries to cancel an Order");

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  ticket.save();

  // make a request to create an order
  const user = global.getAuthCookie();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);
  // assert the order is cancelled
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});
