import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from './utils/signing';
import mongoose from 'mongoose';

const buidTicket = async (title='test', price=420) => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title,
        price 
    });
    await ticket.save();
    return ticket;
}

it('fetches orders for a particular user', async () => {
    // Create three tickets
    const ticketOne = await buidTicket('ticket1', 1);
    const ticketTwo = await buidTicket('ticket2', 2);
    const ticketThree = await buidTicket('ticket3', 3);
    
    // Create one order as User #1
    const userOne = signin('user1@test.com');
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);
    
    // Create two order as User #2
    const userTwo = signin('user2@test.com');
    const { body: orderOne } =await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);
    
    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);
    // Make sure we only got orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});