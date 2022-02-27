import { Publisher, OrderCreatedEvent, Subjects } from "@stackmates/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
