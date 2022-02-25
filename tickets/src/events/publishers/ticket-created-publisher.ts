import { Publisher, Subjects, TicketCreatedEvent } from "@stackmates/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
