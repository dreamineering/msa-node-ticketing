import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@stackmates/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    console.log(`Order Service Listener: Payment Created Event`);
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();
    // NOTE: publish an event to say that the order has been saved

    msg.ack();
  }
}
