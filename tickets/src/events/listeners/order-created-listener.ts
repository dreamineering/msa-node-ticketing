import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@stackmates/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Set the orderId property of the ticket
    ticket.set({ orderId: data.id });
    // Save the ticket
    await ticket.save();

    // listing out properties helps to check you have covered what is needed
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Ack the message
    msg.ack();
  }
}
