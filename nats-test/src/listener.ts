import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('listener connected to nats');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    const options = stan.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('orders-service');
    const subscription = stan.subscribe('ticket:created', 'queue-group-name', options);

    subscription.on('message', (msg: Message) => {
        console.log('Message received');
        console.log(`received event #${msg.getSequence()}, with data: ${String(msg.getData())}`);
        msg.ack();
    });

});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {

    private client: Stan;
    abstract subject: string;
    abstract queueGroupName: string;
    protected ackWait = 5 * 1000;
    abstract onMessage(data: any, msg?: Message): void;
    
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
