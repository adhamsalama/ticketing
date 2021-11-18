import request from 'supertest';
import { app } from '../../app';
import { signin } from './utils/signup';
import mongoose from 'mongoose';

it('returns 404 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .expect(404);
});

it('returns 200 if ticket is found', async () => {
    const title = 'concert';
    const price = 69;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title, price })
        .expect(201);
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);

});