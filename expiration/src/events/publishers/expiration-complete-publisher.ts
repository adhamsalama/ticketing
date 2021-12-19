import { Subjects, Publisher, ExpirationCompleteEvent } from "@kubertickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}