import { Listener, OrderCreatedEvent, Subjects } from "@stackmates/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log(
      "payments-service - OrderCreatedListener - onMessage - data: ",
      data
    );
    const order = await Order.build({
      id: data.id,
      version: data.version,
      price: data.ticket.price,
      userId: data.userId,
      status: data.status,
    });
    await order.save();

    msg.ack();
  }
}
