import { Publisher, Subjects, TicketUpdatedEvent } from "@stackmates/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
