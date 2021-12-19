import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@kubertickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        
    }
}