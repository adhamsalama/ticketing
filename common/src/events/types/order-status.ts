export enum OrderStatus {
    // Order is created but ticket is not reserved
    Created = 'created',

    // 1. Ticket is reserved but user cancelled order
    // 2. Ticket was already reserved (race condition)
    // 3. Order expires before payment
    Cancelled = 'cancelled',

    // Order reserved ticket
    AwaitingPayment = 'awaiting:payment',

    // Order reserved ticket and user provided payment successfully
    Complete = 'complete'
}