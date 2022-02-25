import { Message } from "node-nats-streaming";

import { Listener, TicketCreatedEvent, Subjects } from "@stackmates/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data!", data);
    // Business logic to process the order

    console.log("id", data.id);

    // if it fails should time out
    // but if works fine acknowledge the message
    // has been processed successfully
    msg.ack();
  }
}
