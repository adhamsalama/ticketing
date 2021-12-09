import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { Event } from './base-listener';

export abstract class Publisher<T extends Event>{
    abstract subject: T['subject'];
    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T['data']) {
        this.client.publish(this.subject, data, () => {
            console.log('Event published');
        });
    }
}
