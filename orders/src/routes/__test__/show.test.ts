import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from './utils/signing';

const buidTicket = async (title='test', price=420) => {
    const ticket = Ticket.build({
        title,
        price 
    });
    await ticket.save();
    return ticket;
}

it('fetches orders for a particular user', async () => {
    // Create one tickets
    const ticket = await buidTicket('aadsasda', 420);
    
    // Create order
    const user = signin();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    // Make request to get order
    const { body: response } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);
    expect(response.id).toEqual(order.id);
});

it('returns an error if user fetches an order he did not create', async () => {
    // Create one tickets
    const ticket = await buidTicket('aadsasda', 420);
    
    // Create order
    const user = signin('test1@test.com');
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    // Make request to get order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', signin('test2@test.com'))
        .expect(401);
});
