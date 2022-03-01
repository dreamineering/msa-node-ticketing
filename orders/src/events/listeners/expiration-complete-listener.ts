import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@stackmates/common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    console.log(
      "Expiration service complete event for orderId: ",
      data.orderId
    );
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // don't need to set ticket to null as logic in the ticket model
    // does not look for tickets where the status is cancelled
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id, // use populate on the find to mongo
      },
    });

    msg.ack();
  }
}
