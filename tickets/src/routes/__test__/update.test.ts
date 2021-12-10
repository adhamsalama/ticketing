import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { createTicket, signin } from './utils/signup';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if provided id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'asdasd',
            price: 30
        })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'asdasd',
            price: 30
        })
        .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin('', 'test@test.com'))
        .send({
            title: 'asdas',
            price: 40
        })
        .expect(201);
    //console.log('res body', response.body)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin('', 'test2@test.com'))
        .send({
            title: 'asdasda',
            price: 64
        })
        .expect(401);
});

it('returns a 400 if user provides an invalid title or ptice', async () => {
    // const response = await createTicket('asdasd', 10);
    const cookie = signin('', 'test@test.com');
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asd',
            price: 10
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'asddasda',
            price: -10
        })
        .expect(400);
});

it('returns updates a ticket provided valid inputs', async () => {
    const cookie = signin('', 'test@test.com');
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asd',
            price: 10
        })
        .expect(201);
    const newTitle = 'new title';
    const newPrice = 100;
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    
    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
    const cookie = signin('', 'test@test.com');
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asd',
            price: 10
        })
        .expect(201);
    const newTitle = 'new title';
    const newPrice = 100;
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});