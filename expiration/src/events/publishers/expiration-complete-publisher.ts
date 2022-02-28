import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@stackmates/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
