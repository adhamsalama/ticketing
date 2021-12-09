import { Message, Stan } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    // data with type of any works despite it being of type T['data'] in base-listener
    // any other type doesn't work
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data');
        console.log(data.id);
        console.log(data.title);
        console.log(data.price);
        
        msg.ack();
    }
}