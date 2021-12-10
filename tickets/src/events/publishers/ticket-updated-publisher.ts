import { Publisher, Subjects, TicketUpdatedEvent } from "@kubertickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;

}
