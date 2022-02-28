import mongoose from "mongoose";

import { OrderCancelledEvent, OrderStatus } from "@stackmates/common";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  // Create and save a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 99,
    userId: "abbas",
  });
  ticket.set({ orderId });
  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, orderId, msg };
};

it("updates the ticket and unsets the orderId", async () => {
  const { listener, ticket, data, orderId, msg } = await setup();
  // process the order to save orderId to the ticket
  await listener.onMessage(data, msg);

  // get the updated ticket info
  const updatedTicket = await Ticket.findById(ticket.id);

  // order id should be undefined
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acks the message", async () => {
  const { listener, ticket, data, orderId, msg } = await setup();
  // process the order to save orderId to the ticket
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes that the ticket has been updated", async () => {
  const { listener, ticket, data, orderId, msg } = await setup();
  // process the order to save orderId to the ticket
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
