import { Listener, Subjects, TicketCreatedEvent } from '@kubertickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
export class TicketCreatedClass extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'orders-service';

    onMessage(data: TicketCreatedEvent['data'], msg?: Message) {}
}