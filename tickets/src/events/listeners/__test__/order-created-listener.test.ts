import mongoose from "mongoose";

import { OrderCreatedEvent, OrderStatus } from "@stackmates/common";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 99,
    userId: "abbas",
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "abbas",
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("set the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  // process the order to save orderId to the ticket
  await listener.onMessage(data, msg);
  // get the updated ticket info
  const updatedTicket = await Ticket.findById(ticket.id);
  // assert order id is now set
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message when ticket found", async () => {
  const { listener, data, msg } = await setup();
  // process the order to save orderId to the ticket
  await listener.onMessage(data, msg);
  // assert
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();
  // process the order to save orderId to the ticket
  await listener.onMessage(data, msg);

  // assert
  // https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19565248#overview
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // get Typescript to work Jest
  const payload = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const ticketUpdatedData = JSON.parse(payload);
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
