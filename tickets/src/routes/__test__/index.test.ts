import request from 'supertest';
import { app } from '../../app';
import { signin, createTicket } from './utils/signup';

it('fetch a list of tickets', async () => {
    await Promise.all([createTicket('asd', 10), createTicket('asd', 10), createTicket('asd', 10)]);

    const response = await request(app)
        .get('/api/tickets')
        .expect(200);
    expect(response.body.length).toEqual(3);
});