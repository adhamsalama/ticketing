import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from './utils/signing';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled-publisher';

it('it marks an order as cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 46
    });
    await ticket.save();

    const user = signin();
    // Create order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    
    // Make sure it is cancelled in the database
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder).not.toEqual(null);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

});

it('emits an order cancelled event', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 46
    });
    await ticket.save();

    const user = signin();
    // Create order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});