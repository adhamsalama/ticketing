import { sign } from 'crypto';
import request from 'supertest';
import { app } from '../../app';
import { signin } from './utils/signup';
import { Ticket } from '../../models/ticket';
import { createTicket } from './utils/signup';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user in signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({})
    expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {
    await createTicket('', 10).expect(400);
        await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            price: 10
        })
        .expect(400);
});

it('returns an error if invalid price is provided', async () => {
    await createTicket('asd', -100).expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'asdsadas'
        })
        .expect(400);
});

it('creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await createTicket('asd', 20).expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
});

it('publishes an event', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await createTicket('asd', 20).expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});