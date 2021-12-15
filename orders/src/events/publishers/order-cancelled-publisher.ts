import { Publisher, OrderCancelledEvent, Subjects } from '@kubertickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}