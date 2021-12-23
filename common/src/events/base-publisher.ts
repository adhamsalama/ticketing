import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { Event } from './base-listener';

export abstract class Publisher<T extends Event>{
    abstract subject: T['subject'];
    constructor(protected client: Stan) {
        this.client = client;
    }

    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('Publishing to subject', this.subject);
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) return reject(err);

                console.log('Event published to subject', this.subject);
                resolve();
            });
        });
    }
}
