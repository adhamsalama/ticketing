import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

export interface Event {
    subject: Subjects;
    data: any; 
}

export abstract class Listener<T extends Event> {

    private client: Stan;
    /**
     * Why use T['subject'] instead of Event['subject']
     * To make sure the this.subject is equal to the subject of the supplied event
     * i.e if we used TicketCreatedEvent as the event
     * this.subject has to be equal to TicketCreatedEvent['subject'] which is 'ticket:created'
     * 
     * If we used Event['subject'] we could assign this.subject = Subjects.OrderCreated
     * for the EventCreatedEvent which is definitely not what we want to do 
     */
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    protected ackWait = 5 * 1000;
    abstract onMessage(data: T['data'], msg?: Message): void;
    
    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionsOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionsOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );
            
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });

    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf-8'));
    }
}
