import { Subjects, Publisher, PaymentCreatedEvent } from '@kubertickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}