import nats, { Message } from 'node-nats-streaming';
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