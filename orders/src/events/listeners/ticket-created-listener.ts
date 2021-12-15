import { Listener, Subjects, TicketCreatedEvent } from '@kubertickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-grou-name';

export class TicketCreatedClass extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({ id, title, price} );
        await ticket.save();
        msg.ack();
    }
}