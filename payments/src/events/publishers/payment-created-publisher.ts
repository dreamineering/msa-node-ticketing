import { Subjects, Publisher, PaymentCreatedEvent } from "@stackmates/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
